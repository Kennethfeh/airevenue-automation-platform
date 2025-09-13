#!/usr/bin/env python3
"""
Webinar Funnel System for Closing High-Value Deals
Complete webinar automation from registration to conversion
"""

import json
import sqlite3
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Any
# Removed external dependencies for testing
# from email.mime.text import MIMEText, MIMEMultipart
# import smtplib
# from jinja2 import Template
import uuid

@dataclass
class WebinarEvent:
    id: str
    title: str
    description: str
    presenter: str
    date_time: str
    duration_minutes: int
    max_attendees: int
    registration_url: str
    zoom_link: str
    replay_url: str
    status: str  # scheduled, live, completed, cancelled
    target_audience: str
    offer_price: float
    offer_description: str

@dataclass
class WebinarRegistrant:
    id: str
    webinar_id: str
    email: str
    first_name: str
    last_name: str
    company: str
    title: str
    phone: str
    registration_date: str
    attendance_status: str  # registered, attended, no_show
    engagement_score: int
    converted: bool
    conversion_value: float

@dataclass
class WebinarSequence:
    name: str
    emails: List[Dict[str, Any]]
    triggers: List[str]

class WebinarFunnelManager:
    def __init__(self, db_path="webinar_funnel.db"):
        self.db_path = db_path
        self.init_database()
        self.email_sequences = self.load_email_sequences()
        self.webinar_templates = self.load_webinar_templates()
    
    def init_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS webinar_events (
                id TEXT PRIMARY KEY,
                title TEXT,
                description TEXT,
                presenter TEXT,
                date_time TEXT,
                duration_minutes INTEGER,
                max_attendees INTEGER,
                registration_url TEXT,
                zoom_link TEXT,
                replay_url TEXT,
                status TEXT,
                target_audience TEXT,
                offer_price REAL,
                offer_description TEXT,
                created_date TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS webinar_registrants (
                id TEXT PRIMARY KEY,
                webinar_id TEXT,
                email TEXT,
                first_name TEXT,
                last_name TEXT,
                company TEXT,
                title TEXT,
                phone TEXT,
                registration_date TEXT,
                attendance_status TEXT,
                engagement_score INTEGER DEFAULT 0,
                converted BOOLEAN DEFAULT FALSE,
                conversion_value REAL DEFAULT 0,
                FOREIGN KEY (webinar_id) REFERENCES webinar_events (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS webinar_emails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                registrant_id TEXT,
                sequence_name TEXT,
                email_type TEXT,
                sent_date TEXT,
                opened BOOLEAN DEFAULT FALSE,
                clicked BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (registrant_id) REFERENCES webinar_registrants (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS webinar_conversions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                webinar_id TEXT,
                registrant_id TEXT,
                conversion_type TEXT,
                conversion_value REAL,
                conversion_date TEXT,
                FOREIGN KEY (webinar_id) REFERENCES webinar_events (id),
                FOREIGN KEY (registrant_id) REFERENCES webinar_registrants (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def load_webinar_templates(self) -> Dict[str, Dict]:
        """
        Load webinar templates for different industries and audiences
        """
        return {
            "revenue_automation_masterclass": {
                "title": "The 3-Step Revenue Automation System That's Adding $500K+ ARR to B2B Companies",
                "description": "Discover the exact framework top companies use to automate their sales funnels and increase revenue by 40-60% in 90 days.",
                "duration_minutes": 75,
                "agenda": [
                    "The #1 automation mistake costing you 40% of potential revenue",
                    "3-step framework for automating your entire sales funnel",
                    "Live implementation walkthrough ($5,000 value)",
                    "Case study: How TechCorp increased ARR by $2.1M in 6 months",
                    "Q&A session for your specific situation"
                ],
                "offer": {
                    "title": "Revenue Automation Implementation Program",
                    "price": 4997.00,
                    "description": "90-day done-with-you program to implement the complete revenue automation system",
                    "bonuses": [
                        "Custom automation audit ($2,500 value)",
                        "Sales funnel templates ($1,500 value)",
                        "Email sequence library ($1,000 value)",
                        "6 months of implementation support ($3,000 value)"
                    ]
                }
            },
            "sales_optimization_workshop": {
                "title": "Sales Team Optimization: Double Your Close Rate in 60 Days",
                "description": "Learn the proven strategies that helped 200+ sales teams improve their performance by 100%+.",
                "duration_minutes": 60,
                "agenda": [
                    "The sales velocity formula that predicts revenue",
                    "7 optimization levers that double close rates",
                    "Psychology-based closing techniques",
                    "Tools and systems for consistent results",
                    "Live coaching session"
                ],
                "offer": {
                    "title": "Sales Optimization Accelerator",
                    "price": 2997.00,
                    "description": "60-day program to optimize your entire sales process",
                    "bonuses": [
                        "Sales playbook templates ($1,500 value)",
                        "CRM optimization guide ($1,000 value)",
                        "Weekly group coaching calls ($2,000 value)"
                    ]
                }
            }
        }
    
    def load_email_sequences(self) -> Dict[str, WebinarSequence]:
        """
        Load email sequences for webinar funnel
        """
        sequences = {}
        
        # Registration confirmation sequence
        sequences["registration_confirmation"] = WebinarSequence(
            name="registration_confirmation",
            emails=[
                {
                    "type": "immediate_confirmation",
                    "subject": "You're registered! Here's what happens next...",
                    "delay_hours": 0,
                    "template": """Hi {{first_name}},

Welcome! You're confirmed for:

📅 {{webinar_title}}
🗓️ {{webinar_date}} at {{webinar_time}}
⏰ {{duration}} minutes of pure value

What to expect:
{{agenda_points}}

IMPORTANT: Add this to your calendar now: {{calendar_link}}

Join the webinar: {{webinar_link}}

Can't make it live? No worries - you'll get the replay automatically.

See you there!

Kenneth

P.S. Everyone attending gets our "$10K Revenue Automation Toolkit" absolutely free."""
                },
                {
                    "type": "preparation_email",
                    "subject": "Get ready for tomorrow's masterclass (prep materials inside)",
                    "delay_hours": 24,
                    "template": """Hi {{first_name}},

Tomorrow's masterclass is going to be incredible!

To get the most value, here's what I recommend:

1. Review this pre-work questionnaire: {{prep_link}}
2. Prepare 2-3 specific questions about your situation
3. Have a pen and paper ready (you'll want to take notes!)

Quick reminder:
📅 {{webinar_title}}
🗓️ {{webinar_date}} at {{webinar_time}}
🔗 Join here: {{webinar_link}}

I'm really excited to share this system with you. It's the same framework that's helped 200+ companies add millions in additional revenue.

See you tomorrow!

Kenneth"""
                },
                {
                    "type": "final_reminder",
                    "subject": "Starting in 30 minutes: {{webinar_title}}",
                    "delay_hours": 0,
                    "template": """Hi {{first_name}},

This is it! We're starting in just 30 minutes.

Join the masterclass here: {{webinar_link}}

I'll be sharing:
✓ The exact 3-step system we use
✓ Live implementation walkthrough
✓ Real case studies with actual numbers
✓ Your free $10K automation toolkit

Don't miss this - it's going to be amazing!

Kenneth"""
                }
            ],
            triggers=["registration_completed"]
        )
        
        # Post-webinar sequence for attendees
        sequences["attendee_followup"] = WebinarSequence(
            name="attendee_followup",
            emails=[
                {
                    "type": "thank_you_resources",
                    "subject": "Thanks for attending! Your resources + special offer inside",
                    "delay_hours": 2,
                    "template": """Hi {{first_name}},

Thank you for attending today's masterclass!

As promised, here are your resources:

📋 Revenue Automation Implementation Checklist
📧 Email Sequence Templates Library
📊 ROI Calculator Spreadsheet
🎯 Lead Scoring Template

Download everything: {{resources_link}}

SPECIAL ATTENDEE-ONLY OFFER:

Since you stayed for the full session, I'm extending my {{offer_title}} program to you at a special price.

Regular price: ${{regular_price}}
Your attendee price: ${{special_price}}

This offer expires in 48 hours: {{offer_link}}

Ready to implement? Book your strategy session: {{booking_link}}

Kenneth

P.S. The companies that implement within 48 hours see results 40% faster."""
                },
                {
                    "type": "social_proof_urgency",
                    "subject": "{{first_name}}, 12 hours left (see what others are saying)",
                    "delay_hours": 36,
                    "template": """Hi {{first_name}},

Your special offer expires in 12 hours.

Here's what other attendees are saying:

"Implemented the first step and saw immediate results. This system works!" - Sarah J., VP of Sales

"Finally, a clear roadmap for automation. Worth every penny." - Mike T., CEO

"Increased our leads by 60% in the first month." - Lisa K., Marketing Director

Your {{offer_title}} details:
✓ 90-day implementation program
✓ Custom automation audit
✓ Done-with-you support
✓ $8,000 in bonus materials

Special attendee price: ${{special_price}}
Expires: {{expiry_time}}

Claim your spot: {{offer_link}}

Questions? Just reply to this email.

Kenneth"""
                },
                {
                    "type": "final_call",
                    "subject": "Final call: Offer expires in 2 hours",
                    "delay_hours": 46,
                    "template": """Hi {{first_name}},

This is your final notice.

Your special attendee pricing expires in 2 hours:

{{offer_title}}
Special Price: ${{special_price}} (Save ${{savings}})

After 2 hours, this offer won't be available again.

The choice is yours:
• Implement the system with our help and see results in 30-60 days
• Try to figure it out alone and potentially waste months

Most successful companies choose option #1.

Secure your spot now: {{offer_link}}

Kenneth

P.S. This is the last email about this offer. I won't keep bothering you after this."""
                }
            ],
            triggers=["webinar_attended"]
        )
        
        # No-show sequence
        sequences["no_show_followup"] = WebinarSequence(
            name="no_show_followup",
            emails=[
                {
                    "type": "sorry_you_missed_it",
                    "subject": "Sorry you missed it - here's the replay + bonus",
                    "delay_hours": 2,
                    "template": """Hi {{first_name}},

I noticed you couldn't make it to today's masterclass.

No worries! Here's the full replay: {{replay_link}}

Plus, I'm including your resources anyway:
• Revenue Automation Toolkit ($10K value)
• Implementation checklist
• Email templates library

Download: {{resources_link}}

REPLAY VIEWER SPECIAL:

Since you're watching the replay, I'm extending a special offer for the {{offer_title}} program:

Replay viewer price: ${{replay_price}}
(Limited time - expires in 72 hours)

Details: {{offer_link}}

Watch the replay and let me know if you have any questions!

Kenneth"""
                },
                {
                    "type": "replay_reminder",
                    "subject": "Did you watch the replay yet? (72-hour offer expires soon)",
                    "delay_hours": 48,
                    "template": """Hi {{first_name}},

Quick check - did you get a chance to watch the masterclass replay?

If not, here it is again: {{replay_link}}

Your special replay offer expires in 24 hours:

{{offer_title}} Program
Replay price: ${{replay_price}}
Expires: {{expiry_time}}

This is a one-time opportunity to get the complete system at this price.

Secure your spot: {{offer_link}}

Kenneth"""
                }
            ],
            triggers=["webinar_no_show"]
        )
        
        return sequences
    
    def create_webinar_event(self, template_name: str, date_time: str, 
                           presenter: str = "Kenneth") -> str:
        """
        Create a new webinar event from template
        """
        template = self.webinar_templates.get(template_name)
        if not template:
            raise ValueError(f"Template {template_name} not found")
        
        webinar_id = str(uuid.uuid4())
        
        webinar_event = WebinarEvent(
            id=webinar_id,
            title=template["title"],
            description=template["description"],
            presenter=presenter,
            date_time=date_time,
            duration_minutes=template["duration_minutes"],
            max_attendees=500,
            registration_url=f"https://registration.example.com/{webinar_id}",
            zoom_link=f"https://zoom.us/j/{webinar_id}",
            replay_url=f"https://replay.example.com/{webinar_id}",
            status="scheduled",
            target_audience="B2B Decision Makers",
            offer_price=template["offer"]["price"],
            offer_description=template["offer"]["description"]
        )
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO webinar_events
            (id, title, description, presenter, date_time, duration_minutes,
             max_attendees, registration_url, zoom_link, replay_url, status,
             target_audience, offer_price, offer_description, created_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            webinar_event.id,
            webinar_event.title,
            webinar_event.description,
            webinar_event.presenter,
            webinar_event.date_time,
            webinar_event.duration_minutes,
            webinar_event.max_attendees,
            webinar_event.registration_url,
            webinar_event.zoom_link,
            webinar_event.replay_url,
            webinar_event.status,
            webinar_event.target_audience,
            webinar_event.offer_price,
            webinar_event.offer_description,
            datetime.now().isoformat()
        ))
        
        conn.commit()
        conn.close()
        
        return webinar_id
    
    def register_attendee(self, webinar_id: str, email: str, first_name: str,
                         last_name: str, company: str, title: str = "",
                         phone: str = "") -> str:
        """
        Register a new attendee for webinar
        """
        registrant_id = str(uuid.uuid4())
        
        registrant = WebinarRegistrant(
            id=registrant_id,
            webinar_id=webinar_id,
            email=email,
            first_name=first_name,
            last_name=last_name,
            company=company,
            title=title,
            phone=phone,
            registration_date=datetime.now().isoformat(),
            attendance_status="registered",
            engagement_score=0,
            converted=False,
            conversion_value=0.0
        )
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO webinar_registrants
                (id, webinar_id, email, first_name, last_name, company,
                 title, phone, registration_date, attendance_status,
                 engagement_score, converted, conversion_value)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                registrant.id,
                registrant.webinar_id,
                registrant.email,
                registrant.first_name,
                registrant.last_name,
                registrant.company,
                registrant.title,
                registrant.phone,
                registrant.registration_date,
                registrant.attendance_status,
                registrant.engagement_score,
                registrant.converted,
                registrant.conversion_value
            ))
            
            conn.commit()
            
            # Trigger registration confirmation sequence
            self.start_email_sequence(registrant_id, "registration_confirmation")
            
            return registrant_id
            
        except sqlite3.IntegrityError:
            return None
        finally:
            conn.close()
    
    def start_email_sequence(self, registrant_id: str, sequence_name: str):
        """
        Start email sequence for a registrant
        """
        sequence = self.email_sequences.get(sequence_name)
        if not sequence:
            return False
        
        # Get registrant and webinar data
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT r.*, w.* FROM webinar_registrants r
            JOIN webinar_events w ON r.webinar_id = w.id
            WHERE r.id = ?
        ''', (registrant_id,))
        
        result = cursor.fetchone()
        conn.close()
        
        if not result:
            return False
        
        # Schedule each email in the sequence
        for email_config in sequence.emails:
            self.schedule_email(registrant_id, sequence_name, email_config, result)
        
        return True
    
    def schedule_email(self, registrant_id: str, sequence_name: str, 
                      email_config: Dict, registrant_webinar_data: tuple):
        """
        Schedule individual email from sequence
        """
        # Parse registrant and webinar data
        registrant_data = registrant_webinar_data[:13]  # First 13 columns are registrant
        webinar_data = registrant_webinar_data[13:]    # Rest are webinar
        
        # Personalization data
        template_data = {
            'first_name': registrant_data[3],
            'last_name': registrant_data[4],
            'company': registrant_data[5],
            'webinar_title': webinar_data[1],
            'webinar_date': datetime.fromisoformat(webinar_data[4]).strftime("%B %d, %Y"),
            'webinar_time': datetime.fromisoformat(webinar_data[4]).strftime("%I:%M %p"),
            'duration': str(webinar_data[5]),
            'webinar_link': webinar_data[8],
            'replay_link': webinar_data[9],
            'offer_title': 'Revenue Automation Implementation Program',
            'regular_price': '4,997',
            'special_price': '2,997',
            'replay_price': '3,497',
            'savings': '2,000',
            'expiry_time': (datetime.now() + timedelta(hours=48)).strftime("%B %d at %I:%M %p"),
            'resources_link': 'https://resources.example.com/toolkit',
            'offer_link': 'https://offer.example.com/revenue-automation',
            'booking_link': 'https://calendar.example.com/book-call',
            'calendar_link': 'https://calendar.example.com/add-event',
            'prep_link': 'https://prep.example.com/questionnaire'
        }
        
        # Personalize email with simple replacement
        personalized_subject = email_config["subject"]
        personalized_body = email_config["template"]
        
        # Replace placeholders
        for key, value in template_data.items():
            placeholder = "{{" + key + "}}"
            personalized_subject = personalized_subject.replace(placeholder, str(value))
            personalized_body = personalized_body.replace(placeholder, str(value))
        
        # Calculate send time
        send_time = datetime.now() + timedelta(hours=email_config["delay_hours"])
        
        # Log the scheduled email
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO webinar_emails
            (registrant_id, sequence_name, email_type, sent_date)
            VALUES (?, ?, ?, ?)
        ''', (registrant_id, sequence_name, email_config["type"], send_time.isoformat()))
        
        conn.commit()
        conn.close()
        
        print(f"Scheduled email: {email_config['type']} for {registrant_data[3]} at {send_time}")
        print(f"Subject: {personalized_subject}")
        print("-" * 50)
    
    def mark_attendance(self, registrant_id: str, attended: bool):
        """
        Mark attendee as attended or no-show
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        status = "attended" if attended else "no_show"
        
        cursor.execute('''
            UPDATE webinar_registrants
            SET attendance_status = ?
            WHERE id = ?
        ''', (status, registrant_id))
        
        conn.commit()
        conn.close()
        
        # Trigger appropriate follow-up sequence
        if attended:
            self.start_email_sequence(registrant_id, "attendee_followup")
        else:
            self.start_email_sequence(registrant_id, "no_show_followup")
    
    def record_conversion(self, registrant_id: str, conversion_type: str, 
                         conversion_value: float):
        """
        Record a conversion from webinar attendee
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Update registrant
        cursor.execute('''
            UPDATE webinar_registrants
            SET converted = TRUE, conversion_value = ?
            WHERE id = ?
        ''', (conversion_value, registrant_id))
        
        # Get webinar_id
        cursor.execute('''
            SELECT webinar_id FROM webinar_registrants WHERE id = ?
        ''', (registrant_id,))
        
        webinar_id = cursor.fetchone()[0]
        
        # Record conversion
        cursor.execute('''
            INSERT INTO webinar_conversions
            (webinar_id, registrant_id, conversion_type, conversion_value, conversion_date)
            VALUES (?, ?, ?, ?, ?)
        ''', (webinar_id, registrant_id, conversion_type, conversion_value, datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
    
    def get_webinar_metrics(self, webinar_id: str) -> Dict:
        """
        Get comprehensive metrics for a webinar
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Registration metrics
        cursor.execute('''
            SELECT 
                COUNT(*) as total_registered,
                COUNT(CASE WHEN attendance_status = 'attended' THEN 1 END) as attended,
                COUNT(CASE WHEN attendance_status = 'no_show' THEN 1 END) as no_shows,
                COUNT(CASE WHEN converted = TRUE THEN 1 END) as converted,
                COALESCE(SUM(conversion_value), 0) as total_revenue
            FROM webinar_registrants
            WHERE webinar_id = ?
        ''', (webinar_id,))
        
        metrics = cursor.fetchone()
        
        # Webinar details
        cursor.execute('''
            SELECT title, date_time, offer_price FROM webinar_events WHERE id = ?
        ''', (webinar_id,))
        
        webinar_info = cursor.fetchone()
        conn.close()
        
        if metrics and webinar_info:
            registered, attended, no_shows, converted, revenue = metrics
            title, date_time, offer_price = webinar_info
            
            return {
                'webinar_title': title,
                'webinar_date': date_time,
                'total_registered': registered,
                'attendance_rate': round((attended / registered) * 100, 2) if registered > 0 else 0,
                'no_show_rate': round((no_shows / registered) * 100, 2) if registered > 0 else 0,
                'conversion_rate': round((converted / registered) * 100, 2) if registered > 0 else 0,
                'total_revenue': revenue,
                'revenue_per_registrant': round(revenue / registered, 2) if registered > 0 else 0,
                'offer_price': offer_price
            }
        
        return {}
    
    def get_funnel_overview(self) -> Dict:
        """
        Get overview of all webinar funnels
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                COUNT(DISTINCT w.id) as total_webinars,
                COUNT(r.id) as total_registrants,
                COUNT(CASE WHEN r.attendance_status = 'attended' THEN 1 END) as total_attendees,
                COUNT(CASE WHEN r.converted = TRUE THEN 1 END) as total_conversions,
                COALESCE(SUM(r.conversion_value), 0) as total_revenue
            FROM webinar_events w
            LEFT JOIN webinar_registrants r ON w.id = r.webinar_id
        ''')
        
        result = cursor.fetchone()
        conn.close()
        
        if result:
            webinars, registrants, attendees, conversions, revenue = result
            return {
                'total_webinars': webinars,
                'total_registrants': registrants,
                'total_attendees': attendees,
                'average_attendance_rate': round((attendees / registrants) * 100, 2) if registrants > 0 else 0,
                'overall_conversion_rate': round((conversions / registrants) * 100, 2) if registrants > 0 else 0,
                'total_revenue': revenue,
                'revenue_per_webinar': round(revenue / webinars, 2) if webinars > 0 else 0
            }
        
        return {}

def main():
    """
    Example usage of webinar funnel system
    """
    funnel_manager = WebinarFunnelManager()
    
    # Create a webinar event
    webinar_id = funnel_manager.create_webinar_event(
        "revenue_automation_masterclass",
        "2024-04-15T14:00:00",
        "Kenneth"
    )
    
    print(f"Created webinar: {webinar_id}")
    
    # Register some attendees
    registrants = [
        ("sarah.johnson@techcorp.com", "Sarah", "Johnson", "TechCorp Solutions", "VP of Sales"),
        ("mike.chen@growthmax.io", "Mike", "Chen", "GrowthMax Inc", "CEO"),
        ("lisa.wang@innovate.com", "Lisa", "Wang", "InnovateNow", "Marketing Director")
    ]
    
    registrant_ids = []
    for email, first, last, company, title in registrants:
        reg_id = funnel_manager.register_attendee(webinar_id, email, first, last, company, title)
        registrant_ids.append(reg_id)
        print(f"Registered: {first} {last} from {company}")
    
    # Mark attendance for some registrants
    funnel_manager.mark_attendance(registrant_ids[0], True)  # Sarah attended
    funnel_manager.mark_attendance(registrant_ids[1], True)  # Mike attended
    funnel_manager.mark_attendance(registrant_ids[2], False)  # Lisa no-show
    
    # Record conversions
    funnel_manager.record_conversion(registrant_ids[0], "program_purchase", 2997.00)
    
    # Get metrics
    metrics = funnel_manager.get_webinar_metrics(webinar_id)
    print(f"Webinar metrics: {json.dumps(metrics, indent=2)}")
    
    # Get overall funnel overview
    overview = funnel_manager.get_funnel_overview()
    print(f"Funnel overview: {json.dumps(overview, indent=2)}")

if __name__ == "__main__":
    main()