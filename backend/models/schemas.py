"""
Pydantic Models/Schemas
=======================

Request and response models for the API

Author: Equipo Grupo 4
Date: 2025
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class StudentDataInput(BaseModel):
    """Input data for student prediction"""
    Hours_Studied: int = Field(..., ge=0, le=50, description="Weekly study hours")
    Attendance: float = Field(..., ge=0, le=100, description="Attendance percentage")
    Previous_Scores: float = Field(..., ge=0, le=100, description="Previous academic scores")
    Tutoring_Sessions: int = Field(..., ge=0, le=20, description="Number of tutoring sessions")
    Parental_Involvement: str = Field(..., description="Level of parental involvement")
    Access_to_Resources: str = Field(..., description="Access to educational resources")
    Extracurricular_Activities: str = Field(..., description="Participation in extracurricular activities")
    Motivation_Level: str = Field(..., description="Student motivation level")
    Family_Income: str = Field(..., description="Family income level")
    Teacher_Quality: str = Field(..., description="Quality of teachers")
    Peer_Influence: str = Field(..., description="Peer influence on student")
    Learning_Disabilities: str = Field(..., description="Learning disabilities status")
    Parental_Education_Level: str = Field(..., description="Parents' education level")
    Distance_from_Home: str = Field(..., description="Distance from school to home")

    class Config:
        json_schema_extra = {
            "example": {
                "Hours_Studied": 20,
                "Attendance": 85.5,
                "Previous_Scores": 75.0,
                "Tutoring_Sessions": 2,
                "Parental_Involvement": "Medium",
                "Access_to_Resources": "High",
                "Extracurricular_Activities": "Yes",
                "Motivation_Level": "High",
                "Family_Income": "Medium",
                "Teacher_Quality": "High",
                "Peer_Influence": "Positive",
                "Learning_Disabilities": "No",
                "Parental_Education_Level": "College",
                "Distance_from_Home": "Near"
            }
        }

class PredictionRequest(BaseModel):
    """Request for single prediction"""
    session_id: str = Field(..., description="User session identifier")
    user_name: Optional[str] = Field("Usuario", description="User display name")
    student_data: StudentDataInput
    model_type: Optional[str] = Field("ridge", description="ML model to use")

class PredictionResponse(BaseModel):
    """Response for single prediction"""
    prediction_score: float = Field(..., description="Predicted exam score")
    confidence: float = Field(..., description="Model confidence (R² score)")
    session_id: str = Field(..., description="User session identifier")
    timestamp: datetime = Field(..., description="Prediction timestamp")
    model_used: str = Field(..., description="ML model used")
    recommendation: Optional[str] = Field(None, description="Recommendation based on score")
    saved: bool = Field(..., description="Whether prediction was saved to database")

class CSVUploadResponse(BaseModel):
    """Response for CSV upload processing"""
    upload_id: str = Field(..., description="Upload identifier")
    total_records: int = Field(..., description="Total records in CSV")
    processed_records: int = Field(..., description="Successfully processed records")
    predictions: List[float] = Field(..., description="All predictions")
    avg_prediction: float = Field(..., description="Average prediction score")
    success_rate: float = Field(..., description="Processing success rate")
    session_id: str = Field(..., description="User session identifier")
    errors: List[str] = Field(default=[], description="Processing errors")

class DashboardStats(BaseModel):
    """User dashboard statistics"""
    total_predictions: int = Field(..., description="Total predictions made")
    average_score: float = Field(..., description="Average predicted score")
    best_score: float = Field(..., description="Best predicted score")
    worst_score: float = Field(..., description="Worst predicted score")
    total_csv_uploads: int = Field(..., description="Total CSV files uploaded")
    session_created: Optional[datetime] = Field(None, description="Session creation date")
    last_activity: Optional[datetime] = Field(None, description="Last activity date")

class AcademicAnalytics(BaseModel):
    """Academic analysis of students (aggregated data only)"""
    total_students: int = Field(..., description="Total students analyzed")
    average_score: float = Field(..., description="Average predicted score")
    score_distribution: Dict[str, int] = Field(..., description="Score ranges distribution")
    risk_factors: Dict[str, int] = Field(..., description="Risk factors analysis")
    recommendations: List[Dict[str, str]] = Field(..., description="Institutional recommendations")
    analysis_timestamp: datetime = Field(..., description="When analysis was performed")

class ScoreDistribution(BaseModel):
    """Score distribution breakdown"""
    at_risk: int = Field(..., description="Students with score < 60")
    regular: int = Field(..., description="Students with score 60-75") 
    excellent: int = Field(..., description="Students with score > 75")
    
class RiskFactors(BaseModel):
    """Risk factors analysis"""
    low_attendance: int = Field(..., description="Students with attendance < 70%")
    insufficient_study: int = Field(..., description="Students with study hours < 10")
    no_tutoring: int = Field(..., description="Students with no tutoring sessions")
    high_risk_combined: int = Field(..., description="Students with multiple risk factors")

class ExternalAPIResponse(BaseModel):
    """Response from external API integration"""
    api_used: str = Field(..., description="Name of external API used")
    success: bool = Field(..., description="Whether API call was successful")
    data: Dict[str, Any] = Field(..., description="API response data")
    response_time_ms: Optional[int] = Field(None, description="Response time in milliseconds")
    error: Optional[str] = Field(None, description="Error message if failed")

class SessionInfo(BaseModel):
    """Session information"""
    session_id: str = Field(..., description="Session identifier")
    user_name: str = Field(..., description="User display name")
    created_at: Optional[datetime] = Field(None, description="Session creation date")
    last_activity: Optional[datetime] = Field(None, description="Last activity date")
    is_new: bool = Field(..., description="Whether this is a new session")
