#!/usr/bin/env python3
"""
High-Converting Email Sequences for Prospect Nurturing
Advanced email automation system with personalization and A/B testing
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
import random

@dataclass
class EmailTemplate:
    name: str
    subject_line: str
    body_template: str
    sequence_position: int
    delay_days: int
    conversion_goal: str
    personalization_fields: List[str]
    a_b_variant: str = "A"

@dataclass
class EmailMetrics:
    template_name: str
    sent_count: int = 0
    opened_count: int = 0
    clicked_count: int = 0
    replied_count: int = 0
    converted_count: int = 0
    open_rate: float = 0.0
    click_rate: float = 0.0
    conversion_rate: float = 0.0

class EmailSequenceManager:
    def __init__(self, db_path="email_sequences.db"):
        self.db_path = db_path
        self.init_database()
        self.sequences = self.load_sequences()
    
    def init_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS email_sequences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prospect_email TEXT,
                sequence_name TEXT,
                current_step INTEGER DEFAULT 0,
                status TEXT DEFAULT 'active',
                started_date TEXT,
                last_sent_date TEXT,
                conversions INTEGER DEFAULT 0,
                notes TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS email_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                template_name TEXT,
                prospect_email TEXT,
                sent_date TEXT,
                opened_date TEXT,
                clicked_date TEXT,
                replied_date TEXT,
                converted_date TEXT,
                variant TEXT
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def load_sequences(self) -> Dict[str, List[EmailTemplate]]:
        """
        Load all email sequence templates
        """
        sequences = {
            "cold_outreach": self.get_cold_outreach_sequence(),
            "warm_nurture": self.get_warm_nurture_sequence(),
            "webinar_registration": self.get_webinar_sequence(),
            "demo_followup": self.get_demo_followup_sequence(),
            "reengagement": self.get_reengagement_sequence()
        }
        return sequences
    
    def get_cold_outreach_sequence(self) -> List[EmailTemplate]:
        """
        5-email cold outreach sequence with high conversion rates
        """
        return [
            EmailTemplate(
                name="cold_intro",
                subject_line="Quick question about {{company_name}}'s {{pain_point}}",
                body_template="""Hi {{first_name}},

I noticed {{company_name}} is in the {{industry}} space and likely dealing with {{pain_point}}.

I helped {{similar_company}} increase their revenue by 34% in 3 months by automating their {{specific_process}}.

Worth a 15-minute conversation?

Best,
{{sender_name}}

P.S. Here's a case study showing exactly how we did it: {{case_study_link}}""",
                sequence_position=1,
                delay_days=0,
                conversion_goal="book_call",
                personalization_fields=["first_name", "company_name", "industry", "pain_point", "similar_company", "specific_process"]
            ),
            
            EmailTemplate(
                name="value_add_followup",
                subject_line="{{company_name}} + revenue automation (5-min read)",
                body_template="""Hi {{first_name}},

Since you're focused on {{pain_point}} at {{company_name}}, I thought you'd find this relevant.

I just published a guide on "The 3-Step Revenue Automation Framework" that shows exactly how companies in {{industry}} are:

• Increasing qualified leads by 156%
• Reducing sales cycle time by 42%
• Boosting conversion rates by 28%

Download it here: {{resource_link}}

The framework is based on analyzing 200+ {{industry}} companies and their automation strategies.

Worth implementing at {{company_name}}?

{{sender_name}}""",
                sequence_position=2,
                delay_days=3,
                conversion_goal="download_resource",
                personalization_fields=["first_name", "company_name", "industry", "pain_point"]
            ),
            
            EmailTemplate(
                name="social_proof",
                subject_line="How {{similar_company}} solved their {{pain_point}} (real results)",
                body_template="""Hi {{first_name}},

Quick update on that revenue automation conversation.

{{similar_company}} (also in {{industry}}) just shared their 6-month results:

✓ 234% increase in qualified leads
✓ $2.3M additional revenue
✓ 8 hours/week saved on manual tasks

Their CEO said: "We wish we'd implemented this sooner. The ROI was immediate."

Here's the detailed case study: {{case_study_link}}

The same framework could work for {{company_name}}.

Free strategy call this week?

{{sender_name}}

P.S. I only work with 3 new clients per quarter, so timing matters.""",
                sequence_position=3,
                delay_days=3,
                conversion_goal="book_call",
                personalization_fields=["first_name", "company_name", "industry", "pain_point", "similar_company"]
            ),
            
            EmailTemplate(
                name="scarcity_urgency",
                subject_line="{{first_name}}, closing my calendar for Q4",
                body_template="""Hi {{first_name}},

Quick heads up - I'm closing my calendar for new strategy calls after Friday.

I've got 2 spots left for {{industry}} companies looking to implement revenue automation.

Given {{company_name}}'s situation with {{pain_point}}, I think there's a strong fit.

The companies I work with typically see:
- 40-60% increase in qualified leads within 90 days
- 25-35% reduction in sales cycle time
- 200-300% ROI within 6 months

If you're interested in exploring this, let's connect before Friday.

Book directly here: {{calendar_link}}

{{sender_name}}""",
                sequence_position=4,
                delay_days=4,
                conversion_goal="book_call",
                personalization_fields=["first_name", "company_name", "industry", "pain_point"]
            ),
            
            EmailTemplate(
                name="final_value",
                subject_line="Final resource for {{company_name}} (then I'll stop)",
                body_template="""Hi {{first_name}},

This is my last email (promise).

Since revenue automation clearly isn't a priority for {{company_name}} right now, I wanted to leave you with something valuable.

I've created a simple checklist: "10 Revenue Leaks Every {{industry}} Company Should Fix"

It takes 5 minutes to review and could identify $50K+ in lost opportunities.

Download: {{checklist_link}}

If you ever want to discuss automation for {{company_name}}, just reply to this email.

Best of luck with {{pain_point}}.

{{sender_name}}

P.S. The companies that implement even 3 items from this checklist typically see 20%+ revenue increases within 60 days.""",
                sequence_position=5,
                delay_days=3,
                conversion_goal="download_resource",
                personalization_fields=["first_name", "company_name", "industry", "pain_point"]
            )
        ]
    
    def get_warm_nurture_sequence(self) -> List[EmailTemplate]:
        """
        Nurture sequence for engaged prospects
        """
        return [
            EmailTemplate(
                name="welcome_nurture",
                subject_line="Welcome to the revenue automation community, {{first_name}}",
                body_template="""Hi {{first_name}},

Welcome! You're now part of 2,000+ growth-focused leaders who get weekly insights on revenue automation.

Here's what to expect:

🎯 Tuesday: Growth case study (real companies, real results)
📊 Thursday: Automation tip that takes <5 minutes to implement
💡 Monthly: Deep-dive strategy guide

This week's case study: How {{case_study_company}} increased their sales velocity by 67% using automated lead scoring.

Read it here: {{case_study_link}}

What's your biggest revenue challenge right now? Hit reply and let me know.

{{sender_name}}""",
                sequence_position=1,
                delay_days=0,
                conversion_goal="engagement",
                personalization_fields=["first_name", "case_study_company"]
            ),
            
            EmailTemplate(
                name="value_delivery_1",
                subject_line="The 5-minute automation that increased our leads by 40%",
                body_template="""Hi {{first_name}},

Quick win for you today.

Last month, I helped a client implement a simple lead scoring automation.

Takes 5 minutes to set up.
Resulted in 40% more qualified leads.

Here's exactly how to do it:

1. Score leads based on email engagement (+5 points for opens, +10 for clicks)
2. Add behavioral scoring (+15 for pricing page visits, +20 for demo requests)
3. Auto-assign leads scoring 50+ to your best sales rep

The automation runs 24/7 and ensures hot leads never slip through the cracks.

Want the step-by-step setup guide? Reply "SCORING" and I'll send it over.

{{sender_name}}

P.S. This same client closed 3 deals worth $180K in the first month after implementing this.""",
                sequence_position=2,
                delay_days=3,
                conversion_goal="reply_request",
                personalization_fields=["first_name"]
            ),
            
            EmailTemplate(
                name="case_study_deep_dive",
                subject_line="Case study: $2.1M revenue increase with automation",
                body_template="""Hi {{first_name}},

Detailed case study for you today.

Client: B2B SaaS company (150 employees)
Challenge: Manual sales processes, inconsistent follow-up
Timeline: 4 months implementation

Results:
• 156% increase in qualified leads
• 43% shorter sales cycles  
• $2.1M additional revenue
• 15 hours/week time savings

The complete breakdown: {{case_study_link}}

Key insight: They focused on automating their follow-up sequences first. Simple, but incredibly effective.

Are you dealing with similar challenges? Reply and let me know your situation.

{{sender_name}}""",
                sequence_position=3,
                delay_days=4,
                conversion_goal="engagement",
                personalization_fields=["first_name"]
            )
        ]
    
    def get_webinar_sequence(self) -> List[EmailTemplate]:
        """
        Webinar registration and attendance sequence
        """
        return [
            EmailTemplate(
                name="webinar_invitation",
                subject_line="Free masterclass: 3x your revenue with automation",
                body_template="""Hi {{first_name}},

I'm hosting a live masterclass next week:

"The 3-Step Revenue Automation System That's Adding $500K+ ARR to B2B Companies"

You'll discover:
✓ The #1 automation mistake costing you 40% of potential revenue
✓ My 3-step framework for automating your entire sales funnel
✓ Live implementation walkthrough (worth $5,000 alone)
✓ Q&A session for your specific situation

When: {{webinar_date}} at {{webinar_time}}
Where: Online (link sent after registration)

Save your spot: {{registration_link}}

Only 500 spots available and we're at 340 already.

{{sender_name}}

P.S. Everyone attending gets my "$10K Revenue Automation Toolkit" free.""",
                sequence_position=1,
                delay_days=0,
                conversion_goal="webinar_registration",
                personalization_fields=["first_name", "webinar_date", "webinar_time"]
            ),
            
            EmailTemplate(
                name="webinar_reminder_24h",
                subject_line="Tomorrow: Revenue Automation Masterclass ({{webinar_time}})",
                body_template="""Hi {{first_name}},

Quick reminder: Tomorrow's Revenue Automation Masterclass is at {{webinar_time}}.

I'll be sharing the exact 3-step system that's helped 200+ companies add $500K+ in additional revenue.

Plus, you'll get:
• Live Q&A session
• Free $10K automation toolkit
• Exclusive case study documents

Join here: {{webinar_link}}

Can't make it live? No problem - I'll send you the recording.

See you tomorrow!

{{sender_name}}""",
                sequence_position=2,
                delay_days=6,
                conversion_goal="webinar_attendance",
                personalization_fields=["first_name", "webinar_time"]
            ),
            
            EmailTemplate(
                name="webinar_followup",
                subject_line="Your automation toolkit + next steps",
                body_template="""Hi {{first_name}},

Great having you on the masterclass yesterday!

As promised, here's your complete Revenue Automation Toolkit:

📋 90-Day Implementation Checklist
🎯 Lead Scoring Template  
📧 Email Sequence Templates
📊 ROI Calculator
💼 Strategy Session Workbook

Download everything: {{toolkit_link}}

Ready to implement? I'm opening 5 strategy sessions this week to help attendees create their custom automation roadmap.

These sessions typically result in 40-60% revenue increases within 90 days.

Book your session: {{strategy_session_link}}

Questions? Just reply to this email.

{{sender_name}}""",
                sequence_position=3,
                delay_days=1,
                conversion_goal="book_strategy_session",
                personalization_fields=["first_name"]
            )
        ]
    
    def get_demo_followup_sequence(self) -> List[EmailTemplate]:
        """
        Post-demo nurture sequence
        """
        return [
            EmailTemplate(
                name="demo_thank_you",
                subject_line="Thanks for your time today, {{first_name}}",
                body_template="""Hi {{first_name}},

Thank you for taking the time to explore how revenue automation could work for {{company_name}}.

As discussed, here are the key points from our conversation:

Current situation:
• {{current_challenge_1}}
• {{current_challenge_2}}

Proposed solution:
• {{solution_point_1}}
• {{solution_point_2}}

Expected results:
• {{projected_result_1}}
• {{projected_result_2}}

I've attached a custom implementation roadmap based on your specific needs.

Next steps:
1. Review the roadmap
2. Discuss with your team
3. Schedule follow-up call by {{followup_date}}

Any questions before then? Just reply to this email.

Best,
{{sender_name}}

P.S. The companies that implement within 30 days typically see results 40% faster.""",
                sequence_position=1,
                delay_days=0,
                conversion_goal="proposal_review",
                personalization_fields=["first_name", "company_name", "current_challenge_1", "current_challenge_2", "solution_point_1", "solution_point_2", "projected_result_1", "projected_result_2", "followup_date"]
            ),
            
            EmailTemplate(
                name="demo_value_reinforcement",
                subject_line="{{company_name}}'s automation potential (numbers inside)",
                body_template="""Hi {{first_name}},

I've been thinking about our conversation and ran some additional calculations for {{company_name}}.

Based on your current metrics:
• {{current_leads}} leads/month
• {{conversion_rate}}% conversion rate  
• {{average_deal}} average deal size

With automation implemented:
• 40-60% increase in qualified leads: {{projected_leads}} leads/month
• 25% improvement in conversion: {{improved_conversion}}%
• Projected additional revenue: {{additional_revenue}}/month

Total annual impact: {{annual_impact}}

The investment for this system: {{investment_amount}}
ROI timeline: {{roi_timeline}} months

This conservative projection doesn't include time savings (typically 15+ hours/week) or improved customer experience.

Ready to move forward? Let's schedule that follow-up call.

{{calendar_link}}

{{sender_name}}""",
                sequence_position=2,
                delay_days=2,
                conversion_goal="book_followup",
                personalization_fields=["first_name", "company_name", "current_leads", "conversion_rate", "average_deal", "projected_leads", "improved_conversion", "additional_revenue", "annual_impact", "investment_amount", "roi_timeline"]
            )
        ]
    
    def get_reengagement_sequence(self) -> List[EmailTemplate]:
        """
        Re-engage cold prospects
        """
        return [
            EmailTemplate(
                name="reengagement_curiosity",
                subject_line="Did I lose you, {{first_name}}?",
                body_template="""Hi {{first_name}},

I haven't heard from you in a while, so I'm wondering...

Did I lose you somewhere along the way?

If revenue automation isn't a priority for {{company_name}} right now, I totally get it.

But if you're still interested in:
• Increasing qualified leads by 40-60%
• Reducing sales cycle time by 25%
• Adding $500K+ in annual revenue

Just reply "STILL INTERESTED" and I'll send you our latest case study.

If not, reply "REMOVE" and I'll take you off this email sequence.

Either way, no hard feelings.

{{sender_name}}""",
                sequence_position=1,
                delay_days=0,
                conversion_goal="engagement",
                personalization_fields=["first_name", "company_name"]
            )
        ]
    
    def personalize_email(self, template: EmailTemplate, prospect_data: Dict) -> Dict[str, str]:
        """
        Personalize email template with prospect data
        """
        # Simple string replacement for testing (instead of Jinja2)
        subject_line = template.subject_line
        body_template_str = template.body_template
        
        # Add default values for missing fields
        defaults = {
            'sender_name': 'Kenneth',
            'case_study_link': 'https://example.com/case-study',
            'resource_link': 'https://example.com/resource',
            'calendar_link': 'https://example.com/book-call',
            'checklist_link': 'https://example.com/checklist',
            'webinar_link': 'https://example.com/webinar',
            'registration_link': 'https://example.com/register',
            'toolkit_link': 'https://example.com/toolkit',
            'strategy_session_link': 'https://example.com/strategy'
        }
        
        # Merge prospect data with defaults
        template_data = {**defaults, **prospect_data}
        
        # Simple placeholder replacement
        final_data = {**defaults, **prospect_data}
        
        personalized_subject = subject_line
        personalized_body = body_template_str
        
        # Replace common placeholders
        for key, value in final_data.items():
            placeholder = "{{" + key + "}}"
            if placeholder in personalized_subject:
                personalized_subject = personalized_subject.replace(placeholder, str(value))
            if placeholder in personalized_body:
                personalized_body = personalized_body.replace(placeholder, str(value))
        
        return {
            'subject': personalized_subject,
            'body': personalized_body
        }
    
    def start_sequence(self, prospect_email: str, sequence_name: str, prospect_data: Dict):
        """
        Start email sequence for a prospect
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO email_sequences 
            (prospect_email, sequence_name, started_date)
            VALUES (?, ?, ?)
        ''', (prospect_email, sequence_name, datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        # Send first email immediately
        self.send_next_email(prospect_email, prospect_data)
    
    def send_next_email(self, prospect_email: str, prospect_data: Dict):
        """
        Send the next email in the sequence
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT sequence_name, current_step FROM email_sequences 
            WHERE prospect_email = ? AND status = 'active'
        ''', (prospect_email,))
        
        result = cursor.fetchone()
        if not result:
            return False
        
        sequence_name, current_step = result
        sequence_templates = self.sequences.get(sequence_name, [])
        
        if current_step >= len(sequence_templates):
            # Sequence completed
            cursor.execute('''
                UPDATE email_sequences 
                SET status = 'completed' 
                WHERE prospect_email = ?
            ''', (prospect_email,))
            conn.commit()
            conn.close()
            return False
        
        template = sequence_templates[current_step]
        personalized = self.personalize_email(template, prospect_data)
        
        # Log email metrics
        cursor.execute('''
            INSERT INTO email_metrics 
            (template_name, prospect_email, sent_date, variant)
            VALUES (?, ?, ?, ?)
        ''', (template.name, prospect_email, datetime.now().isoformat(), template.a_b_variant))
        
        # Update sequence progress
        cursor.execute('''
            UPDATE email_sequences 
            SET current_step = ?, last_sent_date = ?
            WHERE prospect_email = ? AND status = 'active'
        ''', (current_step + 1, datetime.now().isoformat(), prospect_email))
        
        conn.commit()
        conn.close()
        
        print(f"Sending email to {prospect_email}: {personalized['subject']}")
        return True
    
    def get_sequence_metrics(self, sequence_name: str) -> Dict:
        """
        Get performance metrics for a sequence
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                COUNT(*) as total_sent,
                COUNT(opened_date) as total_opened,
                COUNT(clicked_date) as total_clicked,
                COUNT(replied_date) as total_replied,
                COUNT(converted_date) as total_converted
            FROM email_metrics em
            JOIN email_sequences es ON em.prospect_email = es.prospect_email
            WHERE es.sequence_name = ?
        ''', (sequence_name,))
        
        result = cursor.fetchone()
        conn.close()
        
        if result and result[0] > 0:
            sent, opened, clicked, replied, converted = result
            return {
                'sequence_name': sequence_name,
                'emails_sent': sent,
                'open_rate': round((opened / sent) * 100, 2) if sent > 0 else 0,
                'click_rate': round((clicked / sent) * 100, 2) if sent > 0 else 0,
                'reply_rate': round((replied / sent) * 100, 2) if sent > 0 else 0,
                'conversion_rate': round((converted / sent) * 100, 2) if sent > 0 else 0
            }
        
        return {'sequence_name': sequence_name, 'emails_sent': 0}

def main():
    """
    Example usage of the email sequence system
    """
    manager = EmailSequenceManager()
    
    # Sample prospect data
    prospect_data = {
        'first_name': 'Sarah',
        'company_name': 'TechCorp Solutions',
        'industry': 'SaaS',
        'pain_point': 'lead generation',
        'similar_company': 'GrowthMax Inc',
        'specific_process': 'sales funnel',
        'current_leads': '150',
        'conversion_rate': '3',
        'average_deal': '$15000'
    }
    
    # Start cold outreach sequence
    manager.start_sequence(
        'sarah.johnson@techcorp.com',
        'cold_outreach',
        prospect_data
    )
    
    # Get metrics
    metrics = manager.get_sequence_metrics('cold_outreach')
    print(f"Sequence metrics: {metrics}")

if __name__ == "__main__":
    main()