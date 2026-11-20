from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import (
    InterviewSession,
    InterviewResponse,
    ActivityLog
)
from app.services.ai_service import ai_service

PREDEFINED_INTERVIEW_QUESTIONS = {
    "Java Developer": [
        {
            "id": 101,
            "category": "Technical Interview",
            "difficulty": "Intermediate",
            "question": "Explain the internal working of HashMap in Java. What happens during a hash collision?",
            "hint": "Mention buckets, hashCode(), equals(), linked lists, and balanced trees (Red-Black tree in Java 8+).",
            "model_answer": "In Java, HashMap uses an array of Node objects. When put(K, V) is called, hashCode() calculates the bucket index. If collisions occur, items were historically stored as a linked list. Since Java 8, once a bucket exceeds 8 entries (TREEIFY_THRESHOLD), it converts into a Red-Black tree (TreeNode), improving worst-case search from O(N) to O(log N)."
        },
        {
            "id": 102,
            "category": "OOP",
            "difficulty": "Intermediate",
            "question": "What is the difference between Method Overloading and Method Overriding in Java?",
            "hint": "Discuss compile-time vs run-time polymorphism, method signatures, and the @Override annotation.",
            "model_answer": "Method Overloading happens within the same class with identical names but different parameter lists (compile-time polymorphism). Method Overriding occurs when a subclass provides a specific implementation of a method declared in its superclass with identical signature and return type (run-time polymorphism)."
        },
        {
            "id": 103,
            "category": "Database",
            "difficulty": "Intermediate",
            "question": "How does Spring Boot manage database transactions with @Transactional, and what is transaction propagation?",
            "hint": "Mention Spring AOP proxy, ThreadLocal connection binding, commit/rollback, and REQUIRED propagation.",
            "model_answer": "Spring uses AOP proxies around @Transactional methods. When invoked, a transaction interceptor opens or binds a database connection. If the method throws an unchecked RuntimeException, it triggers rollback. Propagation (like REQUIRED, REQUIRES_NEW) defines whether to join an existing active transaction or spawn an isolated new transaction."
        }
    ],
    "Python Developer": [
        {
            "id": 201,
            "category": "Technical Interview",
            "difficulty": "Intermediate",
            "question": "Explain the difference between deepcopy and shallow copy in Python with an example.",
            "hint": "Explain how reference pointers vs new compound objects are created in memory for nested lists.",
            "model_answer": "A shallow copy creates a new object but references the child elements of the original collection. Modifying nested mutable objects affects both. A deep copy recursively duplicates the container and all nested objects, creating fully isolated copies in memory."
        },
        {
            "id": 202,
            "category": "Web Development",
            "difficulty": "Intermediate",
            "question": "How does FastAPI achieve high performance with async/await, and when should you define a route with 'async def' versus 'def'?",
            "hint": "Discuss Starlette, AnyIO/asyncio event loop, and thread pool execution for synchronous routes.",
            "model_answer": "FastAPI runs on Starlette and Uvicorn's event loop. When routes are defined with 'async def', they run directly on the event loop (suitable for non-blocking I/O like httpx or async databases). When defined with normal 'def', FastAPI automatically runs them on an external thread pool to prevent blocking the main event loop."
        }
    ],
    "Full Stack Developer": [
        {
            "id": 301,
            "category": "Technical Interview",
            "difficulty": "Intermediate",
            "question": "What is the Virtual DOM in React, and how does the reconciliation algorithm optimize browser performance?",
            "hint": "Discuss lightweight in-memory representation, diffing algorithm, batching, and key prop stability.",
            "model_answer": "The Virtual DOM is an in-memory lightweight representation of the real DOM. When state changes occur, React renders a new virtual tree, runs a heuristic O(N) diffing algorithm against the previous snapshot, and computes the minimal set of real DOM operations to apply in batch."
        },
        {
            "id": 302,
            "category": "Project Discussion",
            "difficulty": "Intermediate",
            "question": "Walk me through how you secured authentication in your full-stack project. How are tokens stored and refreshed?",
            "hint": "Mention password hashing (bcrypt), JWT payload, Authorization Bearer header, and HttpOnly cookies or localStorage tradeoffs.",
            "model_answer": "In full stack architectures, user passwords are encrypted using bcrypt with salt rounds. On login, the server issues a signed JWT token containing user identity and expiration. The client sends this token via Authorization: Bearer headers for protected API calls, while sensitive tokens are ideally kept in HttpOnly Secure cookies to prevent XSS attacks."
        }
    ]
}

def get_interview_questions(target_role: str, category: str = "Technical Interview", difficulty: str = "Intermediate") -> List[Dict[str, Any]]:
    role_questions = PREDEFINED_INTERVIEW_QUESTIONS.get(target_role)
    if not role_questions:
        role_questions = PREDEFINED_INTERVIEW_QUESTIONS.get("Full Stack Developer")
    return role_questions

async def evaluate_answer(
    user_id: int,
    target_role: str,
    category: str,
    difficulty: str,
    question: str,
    student_answer: str,
    db: Session,
    session_id: Optional[int] = None
) -> Dict[str, Any]:
    # 1. Create or retrieve session
    if not session_id:
        session = InterviewSession(
            user_id=user_id,
            category=category,
            target_role=target_role,
            difficulty=difficulty
        )
        db.add(session)
        db.flush()
        session_id = session.id

    # 2. Evaluate via AI or deterministic fallback
    result = await ai_service.evaluate_interview_answer(
        role=target_role,
        category=category,
        question=question,
        student_answer=student_answer,
        difficulty=difficulty
    )

    # 3. Store response
    response_record = InterviewResponse(
        session_id=session_id,
        question=question,
        student_answer=student_answer,
        feedback=result.get("feedback", ""),
        score=result.get("score", 70.0),
        strengths=result.get("strengths", ""),
        missing_concepts=result.get("missing_concepts", ""),
        improved_answer=result.get("improved_answer", "")
    )
    db.add(response_record)

    log = ActivityLog(
        user_id=user_id,
        activity_type="Interview",
        description=f"Completed interview practice on '{question[:45]}...' with score {result.get('score', 70)}/100."
    )
    db.add(log)
    db.commit()

    result["session_id"] = session_id
    return result

