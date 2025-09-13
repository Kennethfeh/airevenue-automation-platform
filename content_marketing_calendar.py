#!/usr/bin/env python3
"""
Content Marketing Calendar and Automation System
Strategic content planning and distribution for revenue growth
"""

import json
import sqlite3
from datetime import datetime, timedelta, date
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Any
import calendar
from enum import Enum

class ContentType(Enum):
    BLOG_POST = "blog_post"
    LINKEDIN_POST = "linkedin_post"
    EMAIL_NEWSLETTER = "email_newsletter"
    CASE_STUDY = "case_study"
    WHITEPAPER = "whitepaper"
    WEBINAR = "webinar"
    PODCAST = "podcast"
    VIDEO = "video"
    INFOGRAPHIC = "infographic"
    SOCIAL_MEDIA = "social_media"

class ContentStatus(Enum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    READY_FOR_REVIEW = "ready_for_review"
    APPROVED = "approved"
    PUBLISHED = "published"
    ARCHIVED = "archived"

@dataclass
class ContentPiece:
    title: str
    content_type: ContentType
    topic: str
    target_audience: str
    keywords: List[str]
    planned_date: str
    status: ContentStatus
    writer: str
    word_count: int
    distribution_channels: List[str]
    conversion_goal: str
    related_campaigns: List[str]
    performance_metrics: Dict[str, Any] = None
    content_brief: str = ""
    actual_publish_date: str = ""

@dataclass
class ContentCampaign:
    name: str
    start_date: str
    end_date: str
    campaign_goals: List[str]
    target_audience: str
    content_pieces: List[str]
    budget: float
    expected_leads: int
    actual_leads: int = 0

class ContentMarketingCalendar:
    def __init__(self, db_path="content_calendar.db"):
        self.db_path = db_path
        self.init_database()
        self.content_templates = self.load_content_templates()
        self.quarterly_themes = self.get_quarterly_themes()
    
    def init_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS content_pieces (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                content_type TEXT,
                topic TEXT,
                target_audience TEXT,
                keywords TEXT,
                planned_date TEXT,
                status TEXT,
                writer TEXT,
                word_count INTEGER,
                distribution_channels TEXT,
                conversion_goal TEXT,
                related_campaigns TEXT,
                content_brief TEXT,
                actual_publish_date TEXT,
                performance_metrics TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS content_campaigns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                start_date TEXT,
                end_date TEXT,
                campaign_goals TEXT,
                target_audience TEXT,
                content_pieces TEXT,
                budget REAL,
                expected_leads INTEGER,
                actual_leads INTEGER DEFAULT 0
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS content_performance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content_id INTEGER,
                metric_name TEXT,
                metric_value REAL,
                recorded_date TEXT,
                FOREIGN KEY (content_id) REFERENCES content_pieces (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def get_quarterly_themes(self) -> Dict[str, Dict]:
        """
        Define quarterly content themes for strategic planning
        """
        return {
            "Q1": {
                "theme": "Foundation & Planning",
                "focus_areas": ["revenue planning", "automation setup", "process optimization"],
                "key_topics": [
                    "2024 Revenue Planning Strategies",
                    "Setting Up Sales Automation",
                    "Lead Generation Best Practices",
                    "CRM Optimization Guide"
                ]
            },
            "Q2": {
                "theme": "Growth & Scale",
                "focus_areas": ["scaling systems", "team optimization", "advanced automation"],
                "key_topics": [
                    "Scaling Revenue Operations",
                    "Advanced Marketing Automation",
                    "Sales Team Productivity",
                    "Customer Success Automation"
                ]
            },
            "Q3": {
                "theme": "Optimization & Results",
                "focus_areas": ["performance analysis", "ROI optimization", "data-driven decisions"],
                "key_topics": [
                    "Revenue Analytics Deep Dive",
                    "Conversion Rate Optimization",
                    "Pipeline Management",
                    "Attribution Modeling"
                ]
            },
            "Q4": {
                "theme": "Innovation & Future",
                "focus_areas": ["emerging trends", "AI integration", "2025 planning"],
                "key_topics": [
                    "AI in Revenue Operations",
                    "Future of Sales Automation",
                    "Predictive Analytics",
                    "2025 Strategy Planning"
                ]
            }
        }
    
    def load_content_templates(self) -> Dict[str, Dict]:
        """
        Load content templates for different types and audiences
        """
        return {
            "blog_post": {
                "how_to_guide": {
                    "structure": [
                        "Hook (problem statement)",
                        "Overview of solution",
                        "Step-by-step instructions",
                        "Common mistakes to avoid",
                        "Tools and resources",
                        "Call to action"
                    ],
                    "word_count_range": [1500, 2500],
                    "keywords_count": 5,
                    "conversion_goal": "lead_magnet_download"
                },
                "case_study": {
                    "structure": [
                        "Company background",
                        "Challenge description",
                        "Solution implementation",
                        "Results and metrics",
                        "Key learnings",
                        "Call to action"
                    ],
                    "word_count_range": [1200, 2000],
                    "keywords_count": 4,
                    "conversion_goal": "book_demo"
                },
                "industry_analysis": {
                    "structure": [
                        "Market overview",
                        "Current trends",
                        "Challenges and opportunities",
                        "Predictions and recommendations",
                        "Action items",
                        "Resources"
                    ],
                    "word_count_range": [2000, 3000],
                    "keywords_count": 6,
                    "conversion_goal": "newsletter_signup"
                }
            },
            "linkedin_post": {
                "thought_leadership": {
                    "structure": [
                        "Strong opinion or insight",
                        "Supporting evidence",
                        "Personal experience",
                        "Question for engagement"
                    ],
                    "word_count_range": [100, 300],
                    "conversion_goal": "profile_visit"
                },
                "case_study_snippet": {
                    "structure": [
                        "Client result headline",
                        "Brief context",
                        "Key strategy/tactic",
                        "Specific results",
                        "Call to action"
                    ],
                    "word_count_range": [150, 250],
                    "conversion_goal": "comment_engagement"
                }
            }
        }
    
    def generate_monthly_calendar(self, year: int, month: int) -> Dict[str, List[ContentPiece]]:
        """
        Generate content calendar for a specific month
        """
        calendar_month = {}
        
        # Get quarter for theme
        quarter = f"Q{(month - 1) // 3 + 1}"
        quarterly_theme = self.quarterly_themes[quarter]
        
        # Get month info
        num_days = calendar.monthrange(year, month)[1]
        
        # Content distribution strategy
        content_schedule = {
            # Monday: Blog posts
            0: [ContentType.BLOG_POST],
            # Tuesday: LinkedIn posts + Email newsletter (every other week)
            1: [ContentType.LINKEDIN_POST, ContentType.EMAIL_NEWSLETTER],
            # Wednesday: Case study or whitepaper (every other week)
            2: [ContentType.CASE_STUDY, ContentType.WHITEPAPER],
            # Thursday: LinkedIn + Social media
            3: [ContentType.LINKEDIN_POST, ContentType.SOCIAL_MEDIA],
            # Friday: Video or podcast (weekly)
            4: [ContentType.VIDEO, ContentType.PODCAST]
        }
        
        for day in range(1, num_days + 1):
            day_date = date(year, month, day)
            weekday = day_date.weekday()
            
            if weekday in content_schedule:
                daily_content = []
                
                for content_type in content_schedule[weekday]:
                    # Skip some content types on certain weeks to avoid overload
                    if content_type == ContentType.EMAIL_NEWSLETTER and day <= 7:
                        continue
                    if content_type in [ContentType.CASE_STUDY, ContentType.WHITEPAPER] and day % 14 != 0:
                        continue
                    
                    content_piece = self.generate_content_piece(
                        content_type, 
                        quarterly_theme, 
                        day_date.isoformat()
                    )
                    daily_content.append(content_piece)
                
                if daily_content:
                    calendar_month[day_date.isoformat()] = daily_content
        
        return calendar_month
    
    def generate_content_piece(self, content_type: ContentType, quarterly_theme: Dict, 
                             planned_date: str) -> ContentPiece:
        """
        Generate a content piece based on type and theme
        """
        import random
        
        # Select topic from quarterly themes
        topic = random.choice(quarterly_theme["key_topics"])
        
        # Generate title based on content type and topic
        title_templates = {
            ContentType.BLOG_POST: [
                f"The Complete Guide to {topic}",
                f"How to Master {topic} in 30 Days",
                f"5 Proven Strategies for {topic}",
                f"{topic}: What Every CEO Needs to Know"
            ],
            ContentType.LINKEDIN_POST: [
                f"Quick insight on {topic}",
                f"Mistake I see companies make with {topic}",
                f"3 lessons learned from {topic}",
                f"Unpopular opinion about {topic}"
            ],
            ContentType.CASE_STUDY: [
                f"How [Company] Achieved 200% Growth with {topic}",
                f"Case Study: {topic} Implementation Success",
                f"Real Results: {topic} in Action"
            ],
            ContentType.WEBINAR: [
                f"Masterclass: Advanced {topic} Strategies",
                f"Live Workshop: {topic} Implementation",
                f"Expert Panel: Future of {topic}"
            ]
        }
        
        title = random.choice(title_templates.get(content_type, [f"Content about {topic}"]))
        
        # Define audience mapping
        audience_mapping = {
            "revenue planning": "C-Suite Executives",
            "automation setup": "Marketing Directors",
            "process optimization": "Operations Managers",
            "scaling systems": "Growth Teams",
            "team optimization": "Sales Directors",
            "performance analysis": "Data Analysts"
        }
        
        target_audience = audience_mapping.get(quarterly_theme["focus_areas"][0], "Business Leaders")
        
        # Generate keywords
        keywords = [
            topic.lower().replace(" ", "-"),
            "revenue automation",
            "sales optimization",
            "business growth",
            "marketing automation"
        ]
        
        # Distribution channels based on content type
        distribution_channels = {
            ContentType.BLOG_POST: ["company_blog", "linkedin", "email_newsletter", "social_media"],
            ContentType.LINKEDIN_POST: ["linkedin", "facebook", "twitter"],
            ContentType.EMAIL_NEWSLETTER: ["email", "linkedin"],
            ContentType.CASE_STUDY: ["company_blog", "sales_enablement", "linkedin", "email"],
            ContentType.WEBINAR: ["email", "linkedin", "facebook", "partner_channels"],
            ContentType.VIDEO: ["youtube", "linkedin", "company_blog", "email"]
        }
        
        # Conversion goals based on content type
        conversion_goals = {
            ContentType.BLOG_POST: "lead_magnet_download",
            ContentType.LINKEDIN_POST: "engagement_and_connection",
            ContentType.EMAIL_NEWSLETTER: "nurture_leads",
            ContentType.CASE_STUDY: "book_demo",
            ContentType.WEBINAR: "webinar_registration",
            ContentType.VIDEO: "youtube_subscribe"
        }
        
        # Word counts based on content type
        word_counts = {
            ContentType.BLOG_POST: random.randint(1500, 2500),
            ContentType.LINKEDIN_POST: random.randint(100, 300),
            ContentType.EMAIL_NEWSLETTER: random.randint(800, 1200),
            ContentType.CASE_STUDY: random.randint(1200, 2000),
            ContentType.WHITEPAPER: random.randint(3000, 5000),
            ContentType.WEBINAR: 500  # Outline length
        }
        
        return ContentPiece(
            title=title,
            content_type=content_type,
            topic=topic,
            target_audience=target_audience,
            keywords=keywords[:3],
            planned_date=planned_date,
            status=ContentStatus.PLANNED,
            writer="Content Team",
            word_count=word_counts.get(content_type, 1000),
            distribution_channels=distribution_channels.get(content_type, ["linkedin"]),
            conversion_goal=conversion_goals.get(content_type, "brand_awareness"),
            related_campaigns=[quarterly_theme["theme"]]
        )
    
    def create_content_campaign(self, campaign: ContentCampaign) -> int:
        """
        Create a new content campaign
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO content_campaigns
            (name, start_date, end_date, campaign_goals, target_audience, 
             content_pieces, budget, expected_leads)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            campaign.name,
            campaign.start_date,
            campaign.end_date,
            json.dumps(campaign.campaign_goals),
            campaign.target_audience,
            json.dumps(campaign.content_pieces),
            campaign.budget,
            campaign.expected_leads
        ))
        
        conn.commit()
        campaign_id = cursor.lastrowid
        conn.close()
        
        return campaign_id
    
    def add_content_piece(self, content: ContentPiece) -> int:
        """
        Add content piece to calendar
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO content_pieces
            (title, content_type, topic, target_audience, keywords, planned_date,
             status, writer, word_count, distribution_channels, conversion_goal,
             related_campaigns, content_brief)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            content.title,
            content.content_type.value,
            content.topic,
            content.target_audience,
            json.dumps(content.keywords),
            content.planned_date,
            content.status.value,
            content.writer,
            content.word_count,
            json.dumps(content.distribution_channels),
            content.conversion_goal,
            json.dumps(content.related_campaigns),
            content.content_brief
        ))
        
        conn.commit()
        content_id = cursor.lastrowid
        conn.close()
        
        return content_id
    
    def get_weekly_schedule(self, start_date: str) -> Dict[str, List[ContentPiece]]:
        """
        Get content schedule for a specific week
        """
        start = datetime.fromisoformat(start_date)
        week_schedule = {}
        
        for i in range(7):
            day = start + timedelta(days=i)
            day_key = day.strftime("%A, %B %d")
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT * FROM content_pieces
                WHERE planned_date = ?
                ORDER BY content_type
            ''', (day.date().isoformat(),))
            
            results = cursor.fetchall()
            conn.close()
            
            daily_content = []
            for row in results:
                content = ContentPiece(
                    title=row[1],
                    content_type=ContentType(row[2]),
                    topic=row[3],
                    target_audience=row[4],
                    keywords=json.loads(row[5]),
                    planned_date=row[6],
                    status=ContentStatus(row[7]),
                    writer=row[8],
                    word_count=row[9],
                    distribution_channels=json.loads(row[10]),
                    conversion_goal=row[11],
                    related_campaigns=json.loads(row[12]),
                    content_brief=row[13]
                )
                daily_content.append(content)
            
            if daily_content:
                week_schedule[day_key] = daily_content
        
        return week_schedule
    
    def generate_content_brief(self, content_piece: ContentPiece) -> str:
        """
        Generate detailed content brief for writers
        """
        template = self.content_templates.get(content_piece.content_type.value, {})
        
        brief = f"""
CONTENT BRIEF: {content_piece.title}

OVERVIEW:
- Content Type: {content_piece.content_type.value.replace('_', ' ').title()}
- Target Audience: {content_piece.target_audience}
- Word Count: {content_piece.word_count} words
- Due Date: {content_piece.planned_date}
- Writer: {content_piece.writer}

TOPIC & OBJECTIVES:
- Main Topic: {content_piece.topic}
- Conversion Goal: {content_piece.conversion_goal}
- Target Keywords: {', '.join(content_piece.keywords)}

STRUCTURE GUIDELINES:
"""
        
        if content_piece.content_type.value in template:
            structure = template[content_piece.content_type.value].get("structure", [])
            for i, section in enumerate(structure, 1):
                brief += f"{i}. {section}\n"
        
        brief += f"""
DISTRIBUTION:
- Primary Channels: {', '.join(content_piece.distribution_channels)}
- Related Campaigns: {', '.join(content_piece.related_campaigns)}

KEY MESSAGING:
- Focus on practical, actionable insights
- Include specific data points and examples
- Maintain authoritative but approachable tone
- End with clear call-to-action

SUCCESS METRICS:
- Engagement rate (target: 5%+)
- Click-through rate (target: 2%+)
- Lead generation (target: 10+ leads)
- Social shares (target: 25+ shares)
"""
        
        return brief
    
    def get_content_performance_report(self, start_date: str, end_date: str) -> Dict:
        """
        Generate performance report for content published in date range
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT cp.*, AVG(perf.metric_value) as avg_performance
            FROM content_pieces cp
            LEFT JOIN content_performance perf ON cp.id = perf.content_id
            WHERE cp.actual_publish_date BETWEEN ? AND ?
            AND cp.status = 'published'
            GROUP BY cp.id
        ''', (start_date, end_date))
        
        results = cursor.fetchall()
        conn.close()
        
        if not results:
            return {"message": "No published content in date range"}
        
        total_pieces = len(results)
        content_by_type = {}
        total_performance = 0
        
        for row in results:
            content_type = row[2]
            performance = row[-1] if row[-1] else 0
            
            if content_type not in content_by_type:
                content_by_type[content_type] = {"count": 0, "total_performance": 0}
            
            content_by_type[content_type]["count"] += 1
            content_by_type[content_type]["total_performance"] += performance
            total_performance += performance
        
        return {
            "period": f"{start_date} to {end_date}",
            "total_content_pieces": total_pieces,
            "average_performance_score": round(total_performance / total_pieces, 2) if total_pieces > 0 else 0,
            "content_breakdown": {
                content_type: {
                    "count": data["count"],
                    "avg_performance": round(data["total_performance"] / data["count"], 2)
                }
                for content_type, data in content_by_type.items()
            }
        }
    
    def suggest_content_gaps(self) -> List[Dict]:
        """
        Analyze calendar and suggest content gaps to fill
        """
        current_date = datetime.now()
        next_month = current_date.replace(month=current_date.month + 1 if current_date.month < 12 else 1)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get content count by type for next month
        cursor.execute('''
            SELECT content_type, COUNT(*) 
            FROM content_pieces
            WHERE planned_date LIKE ?
            GROUP BY content_type
        ''', (next_month.strftime("%Y-%m") + "%",))
        
        current_content = {row[0]: row[1] for row in cursor.fetchall()}
        conn.close()
        
        # Recommended monthly content distribution
        recommended_distribution = {
            ContentType.BLOG_POST.value: 4,  # Weekly
            ContentType.LINKEDIN_POST.value: 12,  # 3x per week
            ContentType.EMAIL_NEWSLETTER.value: 2,  # Bi-weekly
            ContentType.CASE_STUDY.value: 2,  # Bi-weekly
            ContentType.WEBINAR.value: 1,  # Monthly
            ContentType.VIDEO.value: 2,  # Bi-weekly
        }
        
        gaps = []
        for content_type, recommended_count in recommended_distribution.items():
            current_count = current_content.get(content_type, 0)
            if current_count < recommended_count:
                gaps.append({
                    "content_type": content_type,
                    "current_count": current_count,
                    "recommended_count": recommended_count,
                    "gap": recommended_count - current_count,
                    "priority": "high" if recommended_count - current_count > 2 else "medium"
                })
        
        return gaps

def main():
    """
    Example usage of content marketing calendar system
    """
    calendar_manager = ContentMarketingCalendar()
    
    # Generate content for next month
    next_month_content = calendar_manager.generate_monthly_calendar(2024, 4)
    
    # Add content pieces to database
    for date_key, content_list in next_month_content.items():
        for content_piece in content_list:
            content_id = calendar_manager.add_content_piece(content_piece)
            print(f"Added content: {content_piece.title} (ID: {content_id})")
    
    # Create sample campaign
    campaign = ContentCampaign(
        name="Q2 Revenue Automation Campaign",
        start_date="2024-04-01",
        end_date="2024-06-30",
        campaign_goals=["increase_leads", "build_authority", "drive_demos"],
        target_audience="B2B Decision Makers",
        content_pieces=["blog_posts", "case_studies", "webinars"],
        budget=15000.0,
        expected_leads=200
    )
    
    campaign_id = calendar_manager.create_content_campaign(campaign)
    print(f"Created campaign: {campaign.name} (ID: {campaign_id})")
    
    # Get weekly schedule
    weekly_schedule = calendar_manager.get_weekly_schedule("2024-04-01")
    print(f"Weekly schedule: {weekly_schedule}")
    
    # Check content gaps
    gaps = calendar_manager.suggest_content_gaps()
    print(f"Content gaps to fill: {gaps}")

if __name__ == "__main__":
    main()