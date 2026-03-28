from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Court AI ML Service", version="1.0.0")


class AnalyzePayload(BaseModel):
    title: str
    description: str
    caseType: Optional[str] = "General"


class CasePayload(BaseModel):
    _id: Optional[str] = None
    title: str
    description: str
    caseType: Optional[str] = "General"
    urgencyScore: Optional[float] = 0
    complexityScore: Optional[float] = 0
    priority: Optional[str] = "Medium"
    createdAt: Optional[datetime] = None


class RecommendPayload(BaseModel):
    cases: List[CasePayload]


def score_case(text: str) -> tuple[int, int]:
    text_lower = text.lower()
    urgent_terms = ["homicide", "assault", "child", "fraud", "terror", "urgent", "bail"]
    complex_terms = ["forensic", "cyber", "financial", "constitutional", "multiple accused"]

    urgency = min(100, sum(20 for word in urgent_terms if word in text_lower))
    complexity = min(100, sum(18 for word in complex_terms if word in text_lower))
    return urgency, complexity


def priority_from_scores(urgency: int, complexity: int) -> str:
    weighted = urgency * 0.7 + complexity * 0.3
    if weighted >= 65:
        return "High"
    if weighted >= 35:
        return "Medium"
    return "Low"


def summarize(text: str, max_len: int = 220) -> str:
    cleaned = " ".join(text.split())
    if len(cleaned) <= max_len:
        return cleaned
    return cleaned[: max_len - 3] + "..."


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
def analyze(payload: AnalyzePayload):
    merged = f"{payload.title} {payload.description} {payload.caseType}"
    urgency, complexity = score_case(merged)
    priority = priority_from_scores(urgency, complexity)
    summary = summarize(payload.description)
    return {
        "urgencyScore": urgency,
        "complexityScore": complexity,
        "priority": priority,
        "summary": summary,
        "caseType": payload.caseType,
    }


@app.post("/recommend")
def recommend(payload: RecommendPayload):
    ranked = []
    for case in payload.cases:
        pending_days = 0
        if case.createdAt:
            pending_days = (datetime.utcnow() - case.createdAt.replace(tzinfo=None)).days

        severity_score = case.urgencyScore * 0.6 + case.complexityScore * 0.2 + pending_days * 1.2
        ranked.append(
            {
                "id": case._id,
                "title": case.title,
                "priority": case.priority,
                "score": round(severity_score, 2),
                "pendingDays": pending_days,
            }
        )

    ranked.sort(key=lambda item: item["score"], reverse=True)
    return {"topUrgent": ranked[:10], "generatedAt": datetime.utcnow().isoformat()}
