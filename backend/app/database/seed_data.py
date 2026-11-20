import json
from sqlalchemy.orm import Session
from app.models.models import (
    Skill,
    RoleSkillRequirement,
    AssessmentQuestion,
    Resource
)

DEFAULT_SKILLS = [
    # Programming
    {"name": "Core Java", "category": "Programming", "description": "Fundamentals of Java language, syntax, OOP, and JVM."},
    {"name": "Python", "category": "Programming", "description": "Modern Python programming, data structures, and standard library."},
    {"name": "JavaScript", "category": "Programming", "description": "Core JS, ES6+, event loop, async/await, and browser APIs."},
    {"name": "TypeScript", "category": "Programming", "description": "Typed superset of JavaScript for scalable applications."},
    {"name": "C++", "category": "Programming", "description": "High-performance language with manual memory management and STL."},
    # Core CS
    {"name": "Data Structures & Algorithms", "category": "Computer Science", "description": "Arrays, trees, graphs, sorting, searching, DP, and complexity analysis."},
    {"name": "OOP Concepts", "category": "Computer Science", "description": "Inheritance, encapsulation, polymorphism, abstraction, and design principles."},
    {"name": "System Design", "category": "Computer Science", "description": "Scalability, microservices, load balancing, caching, and database sharding."},
    # Web & Frameworks
    {"name": "React.js", "category": "Web Development", "description": "Component-based UI development with hooks, state, and virtual DOM."},
    {"name": "HTML/CSS", "category": "Web Development", "description": "Semantic markup, responsive layouts, flexbox, and grid styling."},
    {"name": "Tailwind CSS", "category": "Web Development", "description": "Utility-first CSS framework for rapid responsive styling."},
    {"name": "Node.js", "category": "Backend Development", "description": "V8 asynchronous JavaScript runtime for server-side apps."},
    {"name": "Express.js", "category": "Backend Development", "description": "Minimalist web framework for Node.js REST APIs."},
    {"name": "Spring Boot", "category": "Backend Development", "description": "Enterprise-grade Java framework for microservices and REST APIs."},
    {"name": "FastAPI", "category": "Backend Development", "description": "Modern, fast Python web framework based on OpenAPI and Pydantic."},
    {"name": "Django", "category": "Backend Development", "description": "Batteries-included web framework for Python."},
    {"name": "REST APIs", "category": "Backend Development", "description": "Architectural principles, HTTP status codes, CRUD endpoints, and JSON."},
    # Database
    {"name": "SQL", "category": "Database", "description": "Structured Query Language for relational database querying and indexing."},
    {"name": "PostgreSQL", "category": "Database", "description": "Advanced open-source relational database management system."},
    {"name": "MongoDB", "category": "Database", "description": "Document-based NoSQL database for flexible semi-structured data."},
    {"name": "JDBC", "category": "Database", "description": "Java Database Connectivity API for relational databases."},
    {"name": "Redis", "category": "Database", "description": "In-memory key-value data store used for caching and messaging."},
    # Tools & DevOps
    {"name": "Git & GitHub", "category": "Tools", "description": "Version control, branching workflows, pull requests, and collaboration."},
    {"name": "Docker", "category": "DevOps", "description": "Containerization platform for packaging and running applications."},
    # AI / ML & Data
    {"name": "Machine Learning", "category": "AI / ML", "description": "Supervised, unsupervised, regression, classification, and model evaluation."},
    {"name": "Deep Learning", "category": "AI / ML", "description": "Neural networks, backpropagation, CNNs, and transformers."},
    {"name": "Pandas", "category": "Data Science", "description": "Data manipulation and analysis library for Python."},
    {"name": "NumPy", "category": "Data Science", "description": "Numerical computation and multi-dimensional array processing in Python."},
    {"name": "Scikit-Learn", "category": "AI / ML", "description": "Machine learning library for predictive data analysis and pipelines."},
    # Professional
    {"name": "Problem Solving", "category": "Professional", "description": "Analytical reasoning and algorithmic approach to complex challenges."},
    {"name": "Communication", "category": "Professional", "description": "Clear verbal and written technical communication and presentation."},
    {"name": "Teamwork", "category": "Professional", "description": "Collaborative problem solving, agile workflows, and code reviews."}
]

DEFAULT_ROLE_REQUIREMENTS = [
    # Java Developer
    {"role_name": "Java Developer", "skill_name": "Core Java", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Java Developer", "skill_name": "OOP Concepts", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Java Developer", "skill_name": "Data Structures & Algorithms", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Java Developer", "skill_name": "SQL", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Java Developer", "skill_name": "JDBC", "required_level": "Intermediate", "priority": "Medium", "category": "Technical"},
    {"role_name": "Java Developer", "skill_name": "Spring Boot", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Java Developer", "skill_name": "REST APIs", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Java Developer", "skill_name": "Git & GitHub", "required_level": "Intermediate", "priority": "Medium", "category": "Tools"},

    # Python Developer
    {"role_name": "Python Developer", "skill_name": "Python", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Python Developer", "skill_name": "OOP Concepts", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Python Developer", "skill_name": "Data Structures & Algorithms", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Python Developer", "skill_name": "SQL", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Python Developer", "skill_name": "FastAPI", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Python Developer", "skill_name": "REST APIs", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Python Developer", "skill_name": "Git & GitHub", "required_level": "Intermediate", "priority": "Medium", "category": "Tools"},
    {"role_name": "Python Developer", "skill_name": "Docker", "required_level": "Beginner", "priority": "Low", "category": "DevOps"},

    # Full Stack Developer
    {"role_name": "Full Stack Developer", "skill_name": "JavaScript", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Full Stack Developer", "skill_name": "React.js", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Full Stack Developer", "skill_name": "Node.js", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Full Stack Developer", "skill_name": "Express.js", "required_level": "Intermediate", "priority": "Medium", "category": "Technical"},
    {"role_name": "Full Stack Developer", "skill_name": "HTML/CSS", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Full Stack Developer", "skill_name": "SQL", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Full Stack Developer", "skill_name": "REST APIs", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Full Stack Developer", "skill_name": "Git & GitHub", "required_level": "Intermediate", "priority": "Medium", "category": "Tools"},

    # Frontend Developer
    {"role_name": "Frontend Developer", "skill_name": "JavaScript", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Frontend Developer", "skill_name": "TypeScript", "required_level": "Intermediate", "priority": "Medium", "category": "Technical"},
    {"role_name": "Frontend Developer", "skill_name": "React.js", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Frontend Developer", "skill_name": "HTML/CSS", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Frontend Developer", "skill_name": "Tailwind CSS", "required_level": "Intermediate", "priority": "Medium", "category": "Technical"},
    {"role_name": "Frontend Developer", "skill_name": "REST APIs", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Frontend Developer", "skill_name": "Git & GitHub", "required_level": "Intermediate", "priority": "Medium", "category": "Tools"},

    # Backend Developer
    {"role_name": "Backend Developer", "skill_name": "Python", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Backend Developer", "skill_name": "SQL", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Backend Developer", "skill_name": "PostgreSQL", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Backend Developer", "skill_name": "REST APIs", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Backend Developer", "skill_name": "FastAPI", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Backend Developer", "skill_name": "System Design", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Backend Developer", "skill_name": "Docker", "required_level": "Intermediate", "priority": "Medium", "category": "DevOps"},
    {"role_name": "Backend Developer", "skill_name": "Git & GitHub", "required_level": "Intermediate", "priority": "Medium", "category": "Tools"},

    # Data Analyst
    {"role_name": "Data Analyst", "skill_name": "Python", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Data Analyst", "skill_name": "SQL", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Data Analyst", "skill_name": "Pandas", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Data Analyst", "skill_name": "NumPy", "required_level": "Intermediate", "priority": "Medium", "category": "Technical"},
    {"role_name": "Data Analyst", "skill_name": "Problem Solving", "required_level": "Intermediate", "priority": "High", "category": "Professional"},
    {"role_name": "Data Analyst", "skill_name": "Communication", "required_level": "Intermediate", "priority": "High", "category": "Professional"},

    # AI/ML Engineer
    {"role_name": "AI/ML Engineer", "skill_name": "Python", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "AI/ML Engineer", "skill_name": "Machine Learning", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "AI/ML Engineer", "skill_name": "Deep Learning", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "AI/ML Engineer", "skill_name": "Pandas", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "AI/ML Engineer", "skill_name": "NumPy", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "AI/ML Engineer", "skill_name": "Scikit-Learn", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "AI/ML Engineer", "skill_name": "Data Structures & Algorithms", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "AI/ML Engineer", "skill_name": "REST APIs", "required_level": "Intermediate", "priority": "Medium", "category": "Technical"},

    # Software Engineer
    {"role_name": "Software Engineer", "skill_name": "Data Structures & Algorithms", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Software Engineer", "skill_name": "OOP Concepts", "required_level": "Advanced", "priority": "High", "category": "Technical"},
    {"role_name": "Software Engineer", "skill_name": "SQL", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Software Engineer", "skill_name": "REST APIs", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Software Engineer", "skill_name": "System Design", "required_level": "Intermediate", "priority": "High", "category": "Technical"},
    {"role_name": "Software Engineer", "skill_name": "Git & GitHub", "required_level": "Intermediate", "priority": "High", "category": "Tools"},
    {"role_name": "Software Engineer", "skill_name": "Problem Solving", "required_level": "Advanced", "priority": "High", "category": "Professional"}
]

DEFAULT_QUESTIONS = [
    # Programming Skills
    {
        "category": "Programming Skills",
        "skill_tag": "Core Java",
        "question_text": "In Java, what happens when an object becomes eligible for garbage collection?",
        "options": [
            "It is immediately destroyed from heap memory",
            "The JVM marks it for collection when memory runs low or during cyclic GC sweeps",
            "The finalize() method is guaranteed to run within 100ms",
            "It moves to the JVM PermGen space immediately"
        ],
        "correct_answer": "The JVM marks it for collection when memory runs low or during cyclic GC sweeps",
        "explanation": "Java Garbage Collection is nondeterministic; objects without active root references become eligible and are reclaimed at JVM discretion.",
        "difficulty": "Intermediate"
    },
    {
        "category": "Programming Skills",
        "skill_tag": "Python",
        "question_text": "What is the primary difference between a Python list and a Python tuple?",
        "options": [
            "Lists are immutable while tuples are mutable",
            "Tuples are immutable while lists are mutable",
            "Tuples can only store integers while lists store any type",
            "Lists use parentheses and tuples use brackets"
        ],
        "correct_answer": "Tuples are immutable while lists are mutable",
        "explanation": "Tuples cannot be altered after creation (immutable), giving them hashability and performance advantages.",
        "difficulty": "Beginner"
    },
    {
        "category": "Programming Skills",
        "skill_tag": "OOP Concepts",
        "question_text": "Which SOLID design principle states that software entities should be open for extension but closed for modification?",
        "options": [
            "Single Responsibility Principle",
            "Open/Closed Principle",
            "Liskov Substitution Principle",
            "Dependency Inversion Principle"
        ],
        "correct_answer": "Open/Closed Principle",
        "explanation": "The Open/Closed Principle (OCP) encourages designing code via inheritance, polymorphism, and interfaces without modifying tested source code.",
        "difficulty": "Intermediate"
    },

    # Data Structures and Algorithms
    {
        "category": "Data Structures and Algorithms",
        "skill_tag": "Data Structures & Algorithms",
        "question_text": "What is the average time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
        "options": [
            "O(1)",
            "O(log N)",
            "O(N)",
            "O(N log N)"
        ],
        "correct_answer": "O(log N)",
        "explanation": "In a balanced BST like an AVL or Red-Black tree, the tree height is bounded by log2(N), making search O(log N).",
        "difficulty": "Intermediate"
    },
    {
        "category": "Data Structures and Algorithms",
        "skill_tag": "Data Structures & Algorithms",
        "question_text": "Which data structure operates on a Last In, First Out (LIFO) order?",
        "options": [
            "Queue",
            "Stack",
            "Linked List",
            "Binary Heap"
        ],
        "correct_answer": "Stack",
        "explanation": "A stack pushes and pops elements from the top, strictly following LIFO behavior.",
        "difficulty": "Beginner"
    },
    {
        "category": "Data Structures and Algorithms",
        "skill_tag": "Data Structures & Algorithms",
        "question_text": "What is the worst-case time complexity of QuickSort?",
        "options": [
            "O(N log N)",
            "O(N)",
            "O(N^2)",
            "O(2^N)"
        ],
        "correct_answer": "O(N^2)",
        "explanation": "When unbalanced pivots are repeatedly chosen (e.g., already sorted array with naive pivot), QuickSort degrades to O(N^2).",
        "difficulty": "Intermediate"
    },

    # Database Management
    {
        "category": "Database Management",
        "skill_tag": "SQL",
        "question_text": "Which SQL clause is used to filter records resulting from an aggregate function like COUNT() or AVG()?",
        "options": [
            "WHERE",
            "HAVING",
            "GROUP BY",
            "ORDER BY"
        ],
        "correct_answer": "HAVING",
        "explanation": "WHERE filters rows before aggregation; HAVING filters groups after aggregation.",
        "difficulty": "Intermediate"
    },
    {
        "category": "Database Management",
        "skill_tag": "SQL",
        "question_text": "What does the 'A' in ACID properties of relational database transactions represent?",
        "options": [
            "Accuracy",
            "Atomicity",
            "Availability",
            "Authentication"
        ],
        "correct_answer": "Atomicity",
        "explanation": "Atomicity ensures that all statements within a transaction succeed completely or roll back entirely ('all-or-nothing').",
        "difficulty": "Beginner"
    },

    # Web Development
    {
        "category": "Web Development",
        "skill_tag": "React.js",
        "question_text": "What is the main purpose of the useEffect hook in React?",
        "options": [
            "To define global Redux actions",
            "To execute side effects such as data fetching, subscriptions, or DOM mutations",
            "To memoize expensive calculations synchronously",
            "To enforce TypeScript types at runtime"
        ],
        "correct_answer": "To execute side effects such as data fetching, subscriptions, or DOM mutations",
        "explanation": "useEffect lets functional components manage lifecycle and external side effects after render cycles.",
        "difficulty": "Intermediate"
    },
    {
        "category": "Web Development",
        "skill_tag": "REST APIs",
        "question_text": "Which HTTP method should be idempotent and used to replace an entire resource representation?",
        "options": [
            "POST",
            "PUT",
            "PATCH",
            "DELETE"
        ],
        "correct_answer": "PUT",
        "explanation": "PUT is idempotent and replaces the target resource, while PATCH modifies partial fields and POST creates new subordinate resources.",
        "difficulty": "Intermediate"
    },

    # Software Engineering
    {
        "category": "Software Engineering",
        "skill_tag": "System Design",
        "question_text": "What is the purpose of a reverse proxy in modern web architecture?",
        "options": [
            "To route client requests to backend servers, provide SSL termination, load balancing, and caching",
            "To compile TypeScript code to minified JavaScript",
            "To encrypt source code repositories",
            "To execute database table migrations automatically"
        ],
        "correct_answer": "To route client requests to backend servers, provide SSL termination, load balancing, and caching",
        "explanation": "Reverse proxies (like Nginx, HAProxy, Envoy) shield backend clusters, terminate SSL, and distribute traffic.",
        "difficulty": "Intermediate"
    },
    {
        "category": "Software Engineering",
        "skill_tag": "Git & GitHub",
        "question_text": "Which Git command integrates changes from a feature branch by re-applying commits on top of another branch?",
        "options": [
            "git merge --no-ff",
            "git rebase",
            "git stash",
            "git cherry-pick --all"
        ],
        "correct_answer": "git rebase",
        "explanation": "Rebase replays local commits on top of the target base branch to produce a clean, linear commit history.",
        "difficulty": "Intermediate"
    },

    # Artificial Intelligence / Machine Learning
    {
        "category": "Artificial Intelligence / Machine Learning",
        "skill_tag": "Machine Learning",
        "question_text": "What is overfitting in machine learning models?",
        "options": [
            "The model performs poorly on training data and well on test data",
            "The model learns noise and specifics of training data, failing to generalize to unseen test data",
            "The model has too few parameters to capture the underlying pattern",
            "The loss function fails to converge due to high learning rate"
        ],
        "correct_answer": "The model learns noise and specifics of training data, failing to generalize to unseen test data",
        "explanation": "Overfitting happens when model complexity is too high relative to data volume, memorizing noise instead of general patterns.",
        "difficulty": "Beginner"
    },
    {
        "category": "Artificial Intelligence / Machine Learning",
        "skill_tag": "Scikit-Learn",
        "question_text": "Which metric is most appropriate for evaluating a classification model on an imbalanced dataset?",
        "options": [
            "Raw Accuracy",
            "F1-Score / PR-AUC",
            "Mean Squared Error",
            "R-squared Score"
        ],
        "correct_answer": "F1-Score / PR-AUC",
        "explanation": "Accuracy can be deceptively high if the majority class dominates; precision, recall, and F1-score evaluate both classes fairly.",
        "difficulty": "Intermediate"
    },

    # Communication Skills
    {
        "category": "Communication Skills",
        "skill_tag": "Communication",
        "question_text": "When presenting a technical architecture decision to cross-functional stakeholders, what is the best strategy?",
        "options": [
            "Present low-level assembly instructions and memory byte offsets",
            "Explain the business context, tradeoffs considered, cost/performance impact, and next steps in clear terms",
            "Avoid discussing risks and only show happy-path diagrams",
            "Insist that non-engineers should not review system decisions"
        ],
        "correct_answer": "Explain the business context, tradeoffs considered, cost/performance impact, and next steps in clear terms",
        "explanation": "Effective engineering communication bridges technical tradeoffs with business impact and user benefits.",
        "difficulty": "Beginner"
    },

    # Problem-Solving
    {
        "category": "Problem-Solving",
        "skill_tag": "Problem Solving",
        "question_text": "When encountering a sudden production API latency spike from 50ms to 2500ms, what is the first logical diagnostic step?",
        "options": [
            "Delete the database and restore a backup from 3 months ago",
            "Inspect APM telemetry, server CPU/memory metrics, active database query locks, and recent deploy logs",
            "Immediately rewrite the entire backend in a different language",
            "Block all incoming client traffic indefinitely"
        ],
        "correct_answer": "Inspect APM telemetry, server CPU/memory metrics, active database query locks, and recent deploy logs",
        "explanation": "Evidence-based debugging isolates whether the bottleneck is CPU starvation, database locking, external dependency, or a bad code deploy.",
        "difficulty": "Intermediate"
    }
]

DEFAULT_RESOURCES = [
    # Java
    {
        "title": "Oracle Official Java Tutorials & Documentation",
        "skill_category": "Programming",
        "skill_name": "Core Java",
        "resource_type": "Documentation",
        "url": "https://docs.oracle.com/javase/tutorial/",
        "difficulty": "Beginner",
        "description": "Comprehensive official guides to Java fundamentals, OOP, collections, and concurrency."
    },
    {
        "title": "Spring Boot Reference Documentation & Guides",
        "skill_category": "Backend Development",
        "skill_name": "Spring Boot",
        "resource_type": "Documentation",
        "url": "https://spring.io/guides",
        "difficulty": "Intermediate",
        "description": "Official Spring guides for building REST APIs, data access with Spring Data JPA, and security."
    },
    # Python
    {
        "title": "Python 3 Official Documentation & Tutorial",
        "skill_category": "Programming",
        "skill_name": "Python",
        "resource_type": "Documentation",
        "url": "https://docs.python.org/3/tutorial/",
        "difficulty": "Beginner",
        "description": "Complete authoritative walkthrough of Python data structures, standard library, and modules."
    },
    {
        "title": "FastAPI Interactive Documentation & Tutorial",
        "skill_category": "Backend Development",
        "skill_name": "FastAPI",
        "resource_type": "Documentation",
        "url": "https://fastapi.tiangolo.com/tutorial/",
        "difficulty": "Beginner",
        "description": "Official FastAPI guide covering path parameters, Pydantic validation, dependency injection, and security."
    },
    # Web & React
    {
        "title": "React Official Documentation (react.dev)",
        "skill_category": "Web Development",
        "skill_name": "React.js",
        "resource_type": "Documentation",
        "url": "https://react.dev/learn",
        "difficulty": "Intermediate",
        "description": "Interactive modern React documentation explaining component architecture, state management, and hooks."
    },
    {
        "title": "MDN Web Docs: JavaScript Fundamentals",
        "skill_category": "Programming",
        "skill_name": "JavaScript",
        "resource_type": "Tutorial",
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        "difficulty": "Beginner",
        "description": "Mozilla Developer Network's industry-standard reference for JavaScript semantics and web APIs."
    },
    # Data Structures & Algorithms
    {
        "title": "LeetCode Algorithmic Practice & Curated Blind 75",
        "skill_category": "Computer Science",
        "skill_name": "Data Structures & Algorithms",
        "resource_type": "Practice",
        "url": "https://leetcode.com/problemset/",
        "difficulty": "Intermediate",
        "description": "Curated coding challenges covering arrays, two-pointers, trees, graphs, and dynamic programming."
    },
    {
        "title": "NeetCode DSA Roadmap & Problem Walkthroughs",
        "skill_category": "Computer Science",
        "skill_name": "Data Structures & Algorithms",
        "resource_type": "Video",
        "url": "https://neetcode.io/roadmap",
        "difficulty": "Intermediate",
        "description": "Structured visual roadmap and video explanations for mastering software engineering technical interviews."
    },
    # Database
    {
        "title": "PostgreSQL Official Documentation",
        "skill_category": "Database",
        "skill_name": "SQL",
        "resource_type": "Documentation",
        "url": "https://www.postgresql.org/docs/",
        "difficulty": "Intermediate",
        "description": "In-depth guide to relational schema design, indexing, transactions, and performance tuning."
    },
    # AI / ML
    {
        "title": "Scikit-Learn User Guide & ML Tutorials",
        "skill_category": "AI / ML",
        "skill_name": "Scikit-Learn",
        "resource_type": "Documentation",
        "url": "https://scikit-learn.org/stable/user_guide.html",
        "difficulty": "Intermediate",
        "description": "Authoritative guide to data preprocessing, cross-validation, hyperparameter tuning, and ML estimators."
    }
]

def seed_database(db: Session):
    # Seed Skills
    for skill_data in DEFAULT_SKILLS:
        existing = db.query(Skill).filter(Skill.name == skill_data["name"]).first()
        if not existing:
            db.add(Skill(**skill_data))
    db.commit()

    # Seed Role Requirements
    for req in DEFAULT_ROLE_REQUIREMENTS:
        existing = db.query(RoleSkillRequirement).filter(
            RoleSkillRequirement.role_name == req["role_name"],
            RoleSkillRequirement.skill_name == req["skill_name"]
        ).first()
        if not existing:
            db.add(RoleSkillRequirement(**req))
    db.commit()

    # Seed Assessment Questions
    for q in DEFAULT_QUESTIONS:
        existing = db.query(AssessmentQuestion).filter(
            AssessmentQuestion.question_text == q["question_text"]
        ).first()
        if not existing:
            db.add(AssessmentQuestion(
                category=q["category"],
                skill_tag=q["skill_tag"],
                question_text=q["question_text"],
                options_json=json.dumps(q["options"]),
                correct_answer=q["correct_answer"],
                explanation=q["explanation"],
                difficulty=q["difficulty"]
            ))
    db.commit()

    # Seed Resources
    for res in DEFAULT_RESOURCES:
        existing = db.query(Resource).filter(
            Resource.title == res["title"]
        ).first()
        if not existing:
            db.add(Resource(**res))
    db.commit()

