#!/usr/bin/env python3
"""
LinkedIn Outreach Templates and Automation System
Advanced LinkedIn messaging and connection strategies for B2B lead generation
"""

import json
import sqlite3
from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import List, Dict, Optional, Any
# from jinja2 import Template  # Removed for testing
import random

@dataclass
class LinkedInMessage:
    template_name: str
    message_type: str  # connection_request, first_message, follow_up, value_add
    subject_line: Optional[str]
    message_template: str
    sequence_position: int
    delay_days: int
    personalization_fields: List[str]
    conversion_goal: str
    character_limit: int = 300

@dataclass
class LinkedInProspect:
    profile_url: str
    first_name: str
    last_name: str
    title: str
    company: str
    industry: str
    location: str
    mutual_connections: int
    recent_activity: List[str]
    pain_points: List[str]
    connection_status: str = "not_connected"

class LinkedInOutreachManager:
    def __init__(self, db_path="linkedin_outreach.db"):
        self.db_path = db_path
        self.init_database()
        self.message_templates = self.load_message_templates()
    
    def init_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS linkedin_prospects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                profile_url TEXT UNIQUE,
                first_name TEXT,
                last_name TEXT,
                title TEXT,
                company TEXT,
                industry TEXT,
                location TEXT,
                mutual_connections INTEGER,
                connection_status TEXT,
                last_contacted TEXT,
                sequence_name TEXT,
                current_step INTEGER DEFAULT 0,
                response_received BOOLEAN DEFAULT FALSE,
                converted BOOLEAN DEFAULT FALSE,
                notes TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS linkedin_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prospect_id INTEGER,
                template_name TEXT,
                message_type TEXT,
                sent_date TEXT,
                response_received BOOLEAN DEFAULT FALSE,
                response_date TEXT,
                conversion_achieved BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (prospect_id) REFERENCES linkedin_prospects (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def load_message_templates(self) -> Dict[str, List[LinkedInMessage]]:
        """
        Load all LinkedIn message template sequences
        """
        return {
            "cold_connection": self.get_cold_connection_sequence(),
            "warm_connection": self.get_warm_connection_sequence(),
            "content_engagement": self.get_content_engagement_sequence(),
            "event_followup": self.get_event_followup_sequence(),
            "referral_introduction": self.get_referral_sequence()
        }
    
    def get_cold_connection_sequence(self) -> List[LinkedInMessage]:
        """
        Cold outreach sequence for LinkedIn connections
        """
        return [
            LinkedInMessage(
                template_name="cold_connection_request",
                message_type="connection_request",
                subject_line=None,
                message_template="""Hi {{first_name}}, I help {{industry}} companies like {{company}} automate their revenue processes. I'd love to connect and share some insights that could benefit {{company}}'s growth.""",
                sequence_position=1,
                delay_days=0,
                personalization_fields=["first_name", "company", "industry"],
                conversion_goal="accept_connection",
                character_limit=300
            ),
            
            LinkedInMessage(
                template_name="connection_thank_you",
                message_type="first_message",
                subject_line="Thanks for connecting!",
                message_template="""Hi {{first_name}},

Thanks for connecting! I noticed you're the {{title}} at {{company}} - impressive work you're doing in the {{industry}} space.

I've been helping similar companies automate their {{pain_point}} processes and typically see 40-60% improvements in efficiency.

{{similar_company}} just implemented our system and increased their qualified leads by 156% in 3 months.

Would you be open to a brief conversation about how this could work for {{company}}?

Best,
Kenneth""",
                sequence_position=2,
                delay_days=1,
                personalization_fields=["first_name", "title", "company", "industry", "pain_point", "similar_company"],
                conversion_goal="book_call",
                character_limit=1000
            ),
            
            LinkedInMessage(
                template_name="value_add_followup",
                message_type="follow_up",
                subject_line="Resource for {{company}}",
                message_template="""Hi {{first_name}},

Following up on my message about revenue automation for {{company}}.

I just published a case study showing how a {{industry}} company solved their {{pain_point}} challenge:

• 234% increase in qualified leads
• 42% reduction in sales cycle time
• $2.1M additional revenue in 6 months

Thought it might be relevant for {{company}}'s situation.

Here's the case study: [link]

Worth a 15-minute discussion?

Kenneth""",
                sequence_position=3,
                delay_days=4,
                personalization_fields=["first_name", "company", "industry", "pain_point"],
                conversion_goal="book_call",
                character_limit=800
            ),
            
            LinkedInMessage(
                template_name="social_proof_message",
                message_type="follow_up",
                subject_line="Quick update for {{company}}",
                message_template="""Hi {{first_name}},

Quick update that might interest you:

{{similar_company}} (also in {{industry}}) just shared their automation results:

✓ 67% faster lead qualification
✓ 8 hours/week time savings
✓ 28% improvement in conversion rates

Their {{similar_title}} said: "We should have done this 2 years ago. The ROI was immediate."

Given {{company}}'s focus on {{pain_point}}, I thought you'd appreciate seeing these results.

Happy to share more details if you're curious.

Kenneth""",
                sequence_position=4,
                delay_days=3,
                personalization_fields=["first_name", "company", "industry", "pain_point", "similar_company", "similar_title"],
                conversion_goal="engagement",
                character_limit=700
            ),
            
            LinkedInMessage(
                template_name="final_value_offer",
                message_type="follow_up",
                subject_line="Final resource for {{company}}",
                message_template="""Hi {{first_name}},

This is my final follow-up (promise!).

Since automation isn't a priority for {{company}} right now, I wanted to leave you with something valuable:

"The 10-Point Revenue Automation Checklist for {{industry}} Companies"

Takes 5 minutes to review, could identify $50K+ in optimization opportunities.

Free download: [link]

If you ever want to discuss automation for {{company}}, feel free to reach out.

Best of luck with your {{pain_point}} initiatives!

Kenneth""",
                sequence_position=5,
                delay_days=5,
                personalization_fields=["first_name", "company", "industry", "pain_point"],
                conversion_goal="download_resource",
                character_limit=600
            )
        ]
    
    def get_warm_connection_sequence(self) -> List[LinkedInMessage]:
        """
        Warm outreach for prospects who've engaged with content
        """
        return [
            LinkedInMessage(
                template_name="warm_connection_request",
                message_type="connection_request",
                subject_line=None,
                message_template="""Hi {{first_name}}, saw your comment on my post about {{topic}}. Great insights! I'd love to connect and continue the conversation.""",
                sequence_position=1,
                delay_days=0,
                personalization_fields=["first_name", "topic"],
                conversion_goal="accept_connection",
                character_limit=300
            ),
            
            LinkedInMessage(
                template_name="warm_first_message",
                message_type="first_message",
                subject_line="Following up on {{topic}}",
                message_template="""Hi {{first_name}},

Thanks for connecting! I really appreciated your comment about {{specific_comment}} on my {{topic}} post.

You clearly understand the challenges around {{pain_point}} in the {{industry}} space.

I've been helping companies like {{company}} solve exactly these issues through automation. The results are typically 40-60% improvements in efficiency.

Given your expertise, I'd love to get your thoughts on our approach.

Quick call this week?

Kenneth""",
                sequence_position=2,
                delay_days=0,
                personalization_fields=["first_name", "specific_comment", "topic", "pain_point", "industry", "company"],
                conversion_goal="book_call",
                character_limit=800
            )
        ]
    
    def get_content_engagement_sequence(self) -> List[LinkedInMessage]:
        """
        Sequence for prospects who engage with content but don't connect
        """
        return [
            LinkedInMessage(
                template_name="content_appreciation",
                message_type="first_message",
                subject_line="Thanks for engaging with my content",
                message_template="""Hi {{first_name}},

I noticed you've been engaging with my content about {{topic}} - thank you!

Your insights on {{specific_insight}} really resonated with me.

I'm curious about your experience with {{pain_point}} at {{company}}. I've been working with {{industry}} companies to solve similar challenges.

Would you be open to a brief conversation? I'd love to hear your perspective.

Kenneth""",
                sequence_position=1,
                delay_days=0,
                personalization_fields=["first_name", "topic", "specific_insight", "pain_point", "company", "industry"],
                conversion_goal="book_call",
                character_limit=600
            )
        ]
    
    def get_event_followup_sequence(self) -> List[LinkedInMessage]:
        """
        Follow-up sequence for event/webinar attendees
        """
        return [
            LinkedInMessage(
                template_name="event_connection_request",
                message_type="connection_request",
                subject_line=None,
                message_template="""Hi {{first_name}}, great meeting you at {{event_name}}! Your questions about {{topic}} were excellent. I'd love to continue our conversation.""",
                sequence_position=1,
                delay_days=0,
                personalization_fields=["first_name", "event_name", "topic"],
                conversion_goal="accept_connection",
                character_limit=300
            ),
            
            LinkedInMessage(
                template_name="event_followup",
                message_type="first_message",
                subject_line="Following up from {{event_name}}",
                message_template="""Hi {{first_name}},

Great connecting at {{event_name}}! I really enjoyed our conversation about {{topic}}.

As promised, here are the resources I mentioned:

• Case study: How {{case_study_company}} automated their {{process}}
• Template: {{template_name}}
• Checklist: {{checklist_name}}

Download everything here: [link]

I'd love to continue our discussion about {{pain_point}} at {{company}}.

Coffee chat next week?

Kenneth""",
                sequence_position=2,
                delay_days=1,
                personalization_fields=["first_name", "event_name", "topic", "case_study_company", "process", "template_name", "checklist_name", "pain_point", "company"],
                conversion_goal="book_meeting",
                character_limit=800
            )
        ]
    
    def get_referral_sequence(self) -> List[LinkedInMessage]:
        """
        Referral introduction sequence
        """
        return [
            LinkedInMessage(
                template_name="referral_connection_request",
                message_type="connection_request",
                subject_line=None,
                message_template="""Hi {{first_name}}, {{referrer_name}} suggested I reach out. I help {{industry}} companies automate their revenue processes. Would love to connect!""",
                sequence_position=1,
                delay_days=0,
                personalization_fields=["first_name", "referrer_name", "industry"],
                conversion_goal="accept_connection",
                character_limit=300
            ),
            
            LinkedInMessage(
                template_name="referral_introduction",
                message_type="first_message",
                subject_line="Introduction from {{referrer_name}}",
                message_template="""Hi {{first_name}},

{{referrer_name}} suggested I reach out to you. They mentioned you're working on {{pain_point}} initiatives at {{company}}.

I recently helped {{referrer_company}} with a similar challenge and they saw:
• {{result_1}}
• {{result_2}}
• {{result_3}}

{{referrer_name}} thought our approach might be relevant for {{company}}'s situation.

Would you be open to a brief conversation?

Best,
Kenneth""",
                sequence_position=2,
                delay_days=0,
                personalization_fields=["first_name", "referrer_name", "pain_point", "company", "referrer_company", "result_1", "result_2", "result_3"],
                conversion_goal="book_call",
                character_limit=800
            )
        ]
    
    def personalize_message(self, template: LinkedInMessage, prospect: LinkedInProspect, 
                          additional_data: Optional[Dict] = None) -> str:
        """
        Personalize LinkedIn message template
        """
        message_template = template.message_template
        
        # Base personalization data from prospect
        template_data = {
            'first_name': prospect.first_name,
            'last_name': prospect.last_name,
            'title': prospect.title,
            'company': prospect.company,
            'industry': prospect.industry,
            'location': prospect.location,
            'pain_point': prospect.pain_points[0] if prospect.pain_points else 'efficiency'
        }
        
        # Add additional data if provided
        if additional_data:
            template_data.update(additional_data)
        
        # Add default values for common fields
        defaults = {
            'similar_company': 'TechCorp Solutions',
            'similar_title': 'VP of Sales',
            'case_study_company': 'GrowthMax Inc',
            'referrer_name': 'John Smith',
            'referrer_company': 'InnovateNow',
            'event_name': 'Revenue Automation Summit',
            'topic': 'revenue automation',
            'process': 'lead qualification',
            'template_name': 'Sales Automation Template',
            'checklist_name': 'Revenue Optimization Checklist',
            'result_1': '40% increase in qualified leads',
            'result_2': '25% reduction in sales cycle',
            'result_3': '$500K additional revenue'
        }
        
        # Merge all data
        final_data = {**defaults, **template_data}
        
        # Simple placeholder replacement
        personalized_message = message_template
        for key, value in final_data.items():
            placeholder = "{{" + key + "}}"
            if placeholder in personalized_message:
                personalized_message = personalized_message.replace(placeholder, str(value))
        
        # Ensure message stays within character limit
        if len(personalized_message) > template.character_limit:
            # Truncate and add ellipsis
            personalized_message = personalized_message[:template.character_limit-3] + "..."
        
        return personalized_message
    
    def add_prospect(self, prospect: LinkedInProspect) -> int:
        """
        Add new LinkedIn prospect to database
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO linkedin_prospects
                (profile_url, first_name, last_name, title, company, industry, 
                 location, mutual_connections, connection_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                prospect.profile_url, prospect.first_name, prospect.last_name,
                prospect.title, prospect.company, prospect.industry,
                prospect.location, prospect.mutual_connections, prospect.connection_status
            ))
            conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            return None
        finally:
            conn.close()
    
    def start_outreach_sequence(self, prospect_id: int, sequence_name: str, 
                              additional_data: Optional[Dict] = None):
        """
        Start LinkedIn outreach sequence for a prospect
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE linkedin_prospects 
            SET sequence_name = ?, current_step = 0, last_contacted = ?
            WHERE id = ?
        ''', (sequence_name, datetime.now().isoformat(), prospect_id))
        
        conn.commit()
        conn.close()
        
        # Send first message
        self.send_next_message(prospect_id, additional_data)
    
    def send_next_message(self, prospect_id: int, additional_data: Optional[Dict] = None):
        """
        Send the next message in the outreach sequence
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM linkedin_prospects WHERE id = ?
        ''', (prospect_id,))
        
        prospect_data = cursor.fetchone()
        if not prospect_data:
            return False
        
        sequence_name = prospect_data[9]  # sequence_name column
        current_step = prospect_data[10]  # current_step column
        
        if sequence_name not in self.message_templates:
            return False
        
        sequence = self.message_templates[sequence_name]
        
        if current_step >= len(sequence):
            # Sequence completed
            cursor.execute('''
                UPDATE linkedin_prospects 
                SET current_step = ?
                WHERE id = ?
            ''', (current_step, prospect_id))
            conn.commit()
            conn.close()
            return False
        
        template = sequence[current_step]
        
        # Create prospect object for personalization
        prospect = LinkedInProspect(
            profile_url=prospect_data[1],
            first_name=prospect_data[2],
            last_name=prospect_data[3],
            title=prospect_data[4],
            company=prospect_data[5],
            industry=prospect_data[6],
            location=prospect_data[7],
            mutual_connections=prospect_data[8],
            recent_activity=[],
            pain_points=['efficiency', 'growth', 'automation']
        )
        
        personalized_message = self.personalize_message(template, prospect, additional_data)
        
        # Log the message
        cursor.execute('''
            INSERT INTO linkedin_messages
            (prospect_id, template_name, message_type, sent_date)
            VALUES (?, ?, ?, ?)
        ''', (prospect_id, template.template_name, template.message_type, datetime.now().isoformat()))
        
        # Update prospect progress
        cursor.execute('''
            UPDATE linkedin_prospects 
            SET current_step = ?, last_contacted = ?
            WHERE id = ?
        ''', (current_step + 1, datetime.now().isoformat(), prospect_id))
        
        conn.commit()
        conn.close()
        
        print(f"LinkedIn message ready for prospect {prospect_id}:")
        print(f"Type: {template.message_type}")
        print(f"Message: {personalized_message}")
        print("-" * 50)
        
        return True
    
    def get_outreach_metrics(self) -> Dict:
        """
        Get LinkedIn outreach performance metrics
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                COUNT(*) as total_prospects,
                COUNT(CASE WHEN connection_status = 'connected' THEN 1 END) as connected,
                COUNT(CASE WHEN response_received = TRUE THEN 1 END) as responded,
                COUNT(CASE WHEN converted = TRUE THEN 1 END) as converted
            FROM linkedin_prospects
        ''')
        
        result = cursor.fetchone()
        conn.close()
        
        if result:
            total, connected, responded, converted = result
            return {
                'total_prospects': total,
                'connection_rate': round((connected / total) * 100, 2) if total > 0 else 0,
                'response_rate': round((responded / total) * 100, 2) if total > 0 else 0,
                'conversion_rate': round((converted / total) * 100, 2) if total > 0 else 0
            }
        
        return {'total_prospects': 0}
    
    def generate_message_variations(self, base_template: str, variations_count: int = 3) -> List[str]:
        """
        Generate A/B test variations of LinkedIn messages
        """
        variations = []
        
        # Different opening variations
        openings = [
            "Hi {{first_name}},",
            "Hello {{first_name}},",
            "Hey {{first_name}},",
            "{{first_name}},"
        ]
        
        # Different closing variations
        closings = [
            "Best regards,\nKenneth",
            "Best,\nKenneth",
            "Cheers,\nKenneth",
            "Thanks,\nKenneth"
        ]
        
        for i in range(variations_count):
            opening = random.choice(openings)
            closing = random.choice(closings)
            
            # Replace opening and closing in base template
            variation = base_template.replace("Hi {{first_name}},", opening)
            variation = variation.replace("Kenneth", closing.split('\n')[1])
            
            variations.append(variation)
        
        return variations

def main():
    """
    Example usage of LinkedIn outreach system
    """
    manager = LinkedInOutreachManager()
    
    # Sample prospect
    prospect = LinkedInProspect(
        profile_url="linkedin.com/in/sarahjohnson",
        first_name="Sarah",
        last_name="Johnson",
        title="VP of Sales",
        company="TechCorp Solutions",
        industry="SaaS",
        location="San Francisco, CA",
        mutual_connections=3,
        recent_activity=["Liked post about sales automation", "Commented on industry article"],
        pain_points=["lead generation", "sales process efficiency"]
    )
    
    # Add prospect and start sequence
    prospect_id = manager.add_prospect(prospect)
    if prospect_id:
        manager.start_outreach_sequence(prospect_id, "cold_connection")
    
    # Get metrics
    metrics = manager.get_outreach_metrics()
    print(f"LinkedIn outreach metrics: {metrics}")

if __name__ == "__main__":
    main()