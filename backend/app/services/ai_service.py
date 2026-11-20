import os
import json
import httpx
from typing import Dict, Any, List, Optional
from app.core.config import settings

class AIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        # Use gemini-2.5-flash or gemini-1.5-flash as default modern Gemini models
        self.model = "gemini-1.5-flash"
        self.endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"

    @property
    def is_available(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def _call_gemini(self, prompt: str, system_instruction: str = "") -> Optional[str]:
        if not self.is_available:
            return None

        url = f"{self.endpoint}?key={self.api_key}"
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 2048,
                "responseMimeType": "application/json"
            }
        }
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.post(url, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts and "text" in parts[0]:
                            return parts[0]["text"]
        except Exception as e:
            # Safe failure fallback - never crash if Gemini is unreachable
            print(f"[AIService Warning] Gemini call failed: {e}. Falling back to deterministic rules.")
            return None
        return None

    async def explain_skill_gap(self, role: str, strong: List[str], improving: List[str], missing: List[str]) -> Dict[str, Any]:
        """Provides concise, constructive educational analysis explaining the skill gaps."""
        system_prompt = (
            "You are StudentPulse AI's Career Guidance Engine. "
            "Analyze the student's current skills against industry expectations. "
            "Return valid JSON with key 'insights' containing an explainable paragraph and key 'focus_areas' as an array of top 3 priorities. "
            "Never invent qualifications or guarantee placement."
        )
        user_prompt = f"""
Target Role: {role}
Verified / Strong Skills: {', '.join(strong) if strong else 'None recorded yet'}
Skills Requiring Improvement: {', '.join(improving) if improving else 'None'}
Missing Required Skills: {', '.join(missing) if missing else 'None'}

Provide transparent, constructive guidance on why these gaps matter and what the student should tackle first.
Respond with JSON:
{{
  "insights": "Detailed constructive explanation...",
  "focus_areas": ["Priority 1", "Priority 2", "Priority 3"]
}}
"""
        raw_json = await self._call_gemini(user_prompt, system_prompt)
        if raw_json:
            try:
                parsed = json.loads(raw_json)
                if "insights" in parsed:
                    return parsed
            except Exception:
                pass

        # Deterministic rule-based fallback
        priority_focus = (missing[:2] + improving[:1]) or ["Core fundamentals", "Framework practice"]
        missing_desc = f"Key skills to acquire include {', '.join(missing[:3])}." if missing else "You have acquired all baseline skills for this role."
        improving_desc = f"Skills requiring deeper hands-on practice include {', '.join(improving[:3])}." if improving else ""

        fallback_insight = (
            f"For the {role} career pathway, your foundational strengths provide a solid base. "
            f"{missing_desc} {improving_desc} "
            f"Focus on practical project implementation and verified technical assessments to demonstrate readiness."
        )
        return {
            "insights": fallback_insight.strip(),
            "focus_areas": priority_focus,
            "is_fallback": True
        }

    async def evaluate_interview_answer(
        self,
        role: str,
        category: str,
        question: str,
        student_answer: str,
        difficulty: str
    ) -> Dict[str, Any]:
        """Evaluates student interview answer using transparent rubric."""
        system_prompt = (
            "You are a technical interview evaluator on StudentPulse AI. "
            "Evaluate student answers objectively on a 0-100 scale based on technical accuracy, clarity, and completeness. "
            "Return JSON only. Do not claim to be an official employer evaluation."
        )
        user_prompt = f"""
Job Role: {role}
Category: {category}
Difficulty: {difficulty}
Question: {question}
Student's Submitted Answer:
\"\"\"{student_answer}\"\"\"

Provide an objective evaluation. Respond ONLY in valid JSON:
{{
  "score": 75.0,
  "feedback": "Concise summary of candidate's response quality...",
  "strengths": "Identified correct concepts...",
  "missing_concepts": "Key terminology or architectural tradeoffs missed...",
  "improved_answer": "Model comprehensive response demonstrating best practices..."
}}
"""
        raw_json = await self._call_gemini(user_prompt, system_prompt)
        if raw_json:
            try:
                parsed = json.loads(raw_json)
                if "score" in parsed and "feedback" in parsed:
                    parsed["is_fallback"] = False
                    return parsed
            except Exception:
                pass

        # Transparent rule-based fallback evaluation
        words = len(student_answer.strip().split())
        score = 65.0
        if words < 10:
            score = 30.0
            feedback = "Answer is too brief. Please elaborate on core principles, lifecycle, and practical use cases."
            missing = "Detailed explanation, examples, and edge case handling."
            strengths = "Initial attempt submitted."
        elif words < 35:
            score = 60.0
            feedback = "Valid basic overview provided. Adding specific technical examples and architecture nuances would significantly improve it."
            missing = "In-depth code context and performance considerations."
            strengths = "Good general understanding of the topic."
        else:
            score = 80.0
            feedback = "Comprehensive response covering primary concepts effectively."
            missing = "Production edge cases and real-world scalability considerations."
            strengths = "Clear terminology and structured explanation."

        return {
            "score": score,
            "feedback": feedback,
            "strengths": strengths,
            "missing_concepts": missing,
            "improved_answer": f"In a professional {role} interview for this topic, explain definition, underlying mechanism, trade-offs, and a concrete example: '{question}'.",
            "is_fallback": True
        }

ai_service = AIService()

