#!/usr/bin/env python3
"""
Automated Upselling Triggers and System
AI-driven upselling automation based on customer behavior, usage patterns, and lifecycle stage
"""

import json
import sqlite3
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Any, Tuple
import uuid
from enum import Enum
import math

class UpsellTriggerType(Enum):
    USAGE_THRESHOLD = "usage_threshold"
    FEATURE_ADOPTION = "feature_adoption"
    TIME_BASED = "time_based"
    BEHAVIOR_PATTERN = "behavior_pattern"
    SUCCESS_MILESTONE = "success_milestone"
    SUPPORT_INTERACTION = "support_interaction"
    ENGAGEMENT_SCORE = "engagement_score"

class UpsellStatus(Enum):
    IDENTIFIED = "identified"
    TRIGGERED = "triggered"
    PRESENTED = "presented"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    EXPIRED = "expired"

class CustomerTier(Enum):
    BASIC = "basic"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"
    CUSTOM = "custom"

@dataclass
class Customer:
    id: str
    company_name: str
    contact_email: str
    current_tier: CustomerTier
    monthly_spend: float
    contract_start_date: str
    contract_end_date: str
    usage_metrics: Dict[str, Any]
    engagement_score: int
    success_metrics: Dict[str, Any]
    last_activity_date: str
    health_score: int

@dataclass
class UpsellTrigger:
    id: str
    trigger_name: str
    trigger_type: UpsellTriggerType
    conditions: Dict[str, Any]
    target_offer: str
    priority_score: int
    active: bool
    success_rate: float
    created_date: str

@dataclass
class UpsellOpportunity:
    id: str
    customer_id: str
    trigger_id: str
    opportunity_description: str
    recommended_product: str
    estimated_value: float
    probability_score: float
    urgency_score: int
    status: UpsellStatus
    created_date: str
    expires_date: str
    presentation_count: int
    last_presented_date: Optional[str]

@dataclass
class UpsellCampaign:
    id: str
    opportunity_id: str
    campaign_type: str  # email, in_app, sales_call, webinar
    message_content: str
    call_to_action: str
    sent_date: str
    response_date: Optional[str]
    conversion_date: Optional[str]
    status: str

class AutomatedUpsellingSystem:
    def __init__(self, db_path="upselling_system.db"):
        self.db_path = db_path
        self.init_database()
        self.upsell_triggers = self.load_upsell_triggers()
        self.upsell_strategies = self.load_upsell_strategies()
    
    def init_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS customers (
                id TEXT PRIMARY KEY,
                company_name TEXT,
                contact_email TEXT,
                current_tier TEXT,
                monthly_spend REAL,
                contract_start_date TEXT,
                contract_end_date TEXT,
                usage_metrics TEXT,
                engagement_score INTEGER,
                success_metrics TEXT,
                last_activity_date TEXT,
                health_score INTEGER,
                created_date TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS upsell_triggers (
                id TEXT PRIMARY KEY,
                trigger_name TEXT,
                trigger_type TEXT,
                conditions TEXT,
                target_offer TEXT,
                priority_score INTEGER,
                active BOOLEAN,
                success_rate REAL,
                created_date TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS upsell_opportunities (
                id TEXT PRIMARY KEY,
                customer_id TEXT,
                trigger_id TEXT,
                opportunity_description TEXT,
                recommended_product TEXT,
                estimated_value REAL,
                probability_score REAL,
                urgency_score INTEGER,
                status TEXT,
                created_date TEXT,
                expires_date TEXT,
                presentation_count INTEGER DEFAULT 0,
                last_presented_date TEXT,
                FOREIGN KEY (customer_id) REFERENCES customers (id),
                FOREIGN KEY (trigger_id) REFERENCES upsell_triggers (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS upsell_campaigns (
                id TEXT PRIMARY KEY,
                opportunity_id TEXT,
                campaign_type TEXT,
                message_content TEXT,
                call_to_action TEXT,
                sent_date TEXT,
                response_date TEXT,
                conversion_date TEXT,
                status TEXT,
                FOREIGN KEY (opportunity_id) REFERENCES upsell_opportunities (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS upsell_analytics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                opportunity_id TEXT,
                customer_tier TEXT,
                trigger_type TEXT,
                conversion_value REAL,
                time_to_conversion INTEGER,
                campaign_touchpoints INTEGER,
                recorded_date TEXT,
                FOREIGN KEY (opportunity_id) REFERENCES upsell_opportunities (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def load_upsell_triggers(self) -> List[UpsellTrigger]:
        """
        Load predefined upsell triggers with conditions and scoring
        """
        triggers = []
        
        # Usage threshold triggers
        triggers.append(UpsellTrigger(
            id="usage_80_percent",
            trigger_name="80% Usage Threshold Reached",
            trigger_type=UpsellTriggerType.USAGE_THRESHOLD,
            conditions={
                "usage_percentage": 80,
                "consecutive_months": 2,
                "feature_categories": ["core", "reporting"]
            },
            target_offer="next_tier_upgrade",
            priority_score=90,
            active=True,
            success_rate=0.35,
            created_date=datetime.now().isoformat()
        ))
        
        triggers.append(UpsellTrigger(
            id="api_limit_approaching",
            trigger_name="API Usage Limit Approaching",
            trigger_type=UpsellTriggerType.USAGE_THRESHOLD,
            conditions={
                "api_usage_percentage": 90,
                "time_frame_days": 30,
                "trend": "increasing"
            },
            target_offer="api_expansion_package",
            priority_score=85,
            active=True,
            success_rate=0.42,
            created_date=datetime.now().isoformat()
        ))
        
        # Feature adoption triggers
        triggers.append(UpsellTrigger(
            id="advanced_feature_discovery",
            trigger_name="Advanced Feature Discovery",
            trigger_type=UpsellTriggerType.FEATURE_ADOPTION,
            conditions={
                "advanced_features_viewed": ["automation_builder", "custom_integrations", "advanced_analytics"],
                "view_frequency": 3,
                "time_spent_minutes": 15
            },
            target_offer="professional_features_package",
            priority_score=75,
            active=True,
            success_rate=0.28,
            created_date=datetime.now().isoformat()
        ))
        
        # Success milestone triggers
        triggers.append(UpsellTrigger(
            id="roi_achievement",
            trigger_name="ROI Milestone Achievement",
            trigger_type=UpsellTriggerType.SUCCESS_MILESTONE,
            conditions={
                "roi_percentage": 200,
                "measurement_period_months": 6,
                "satisfaction_score": 8
            },
            target_offer="enterprise_expansion",
            priority_score=95,
            active=True,
            success_rate=0.55,
            created_date=datetime.now().isoformat()
        ))
        
        # Time-based triggers
        triggers.append(UpsellTrigger(
            id="contract_renewal_window",
            trigger_name="Contract Renewal Window",
            trigger_type=UpsellTriggerType.TIME_BASED,
            conditions={
                "days_until_renewal": 60,
                "usage_trend": "stable_or_growing",
                "health_score_minimum": 7
            },
            target_offer="renewal_with_upgrade",
            priority_score=80,
            active=True,
            success_rate=0.45,
            created_date=datetime.now().isoformat()
        ))
        
        # Engagement score triggers
        triggers.append(UpsellTrigger(
            id="high_engagement_power_user",
            trigger_name="High Engagement Power User",
            trigger_type=UpsellTriggerType.ENGAGEMENT_SCORE,
            conditions={
                "engagement_score_minimum": 85,
                "consecutive_months": 3,
                "feature_adoption_rate": 0.7
            },
            target_offer="premium_addon_bundle",
            priority_score=70,
            active=True,
            success_rate=0.38,
            created_date=datetime.now().isoformat()
        ))
        
        # Support interaction triggers
        triggers.append(UpsellTrigger(
            id="limitation_support_requests",
            trigger_name="Feature Limitation Support Requests",
            trigger_type=UpsellTriggerType.SUPPORT_INTERACTION,
            conditions={
                "support_ticket_keywords": ["limit", "upgrade", "more features", "restriction"],
                "ticket_frequency": 3,
                "time_frame_days": 30
            },
            target_offer="limitation_removal_package",
            priority_score=88,
            active=True,
            success_rate=0.48,
            created_date=datetime.now().isoformat()
        ))
        
        return triggers
    
    def load_upsell_strategies(self) -> Dict[str, Dict]:
        """
        Load upselling strategies and messaging templates
        """
        return {
            "next_tier_upgrade": {
                "title": "Upgrade to Professional Plan",
                "description": "Unlock advanced features and increased limits",
                "value_proposition": "Based on your usage patterns, upgrading would save you time and unlock new capabilities",
                "pricing_strategy": "show_monthly_savings",
                "urgency_factors": ["current_limitations", "competitor_features"],
                "success_stories": ["similar_company_results", "roi_testimonials"]
            },
            "api_expansion_package": {
                "title": "API Usage Expansion Package",
                "description": "Increase your API limits with premium support",
                "value_proposition": "Never hit API limits again with 10x capacity and priority support",
                "pricing_strategy": "usage_based_pricing",
                "urgency_factors": ["current_bottlenecks", "scaling_needs"],
                "success_stories": ["performance_improvements", "scale_achievements"]
            },
            "professional_features_package": {
                "title": "Professional Features Add-On",
                "description": "Advanced automation and integration capabilities",
                "value_proposition": "Automate complex workflows and integrate with your entire tech stack",
                "pricing_strategy": "feature_value_pricing",
                "urgency_factors": ["time_savings", "competitive_advantage"],
                "success_stories": ["automation_success", "integration_benefits"]
            },
            "enterprise_expansion": {
                "title": "Enterprise Solution Upgrade",
                "description": "Full enterprise features with dedicated support",
                "value_proposition": "Scale your success with enterprise-grade features and white-glove support",
                "pricing_strategy": "value_based_pricing",
                "urgency_factors": ["growth_trajectory", "team_expansion"],
                "success_stories": ["enterprise_case_studies", "scale_testimonials"]
            }
        }
    
    def create_customer_profile(self, company_name: str, contact_email: str, 
                              current_tier: CustomerTier, monthly_spend: float,
                              contract_start_date: str, contract_end_date: str,
                              usage_metrics: Dict, success_metrics: Dict) -> str:
        """
        Create comprehensive customer profile for upselling analysis
        """
        customer_id = str(uuid.uuid4())
        
        # Calculate engagement score based on usage patterns
        engagement_score = self.calculate_engagement_score(usage_metrics)
        
        # Calculate health score based on various factors
        health_score = self.calculate_health_score(usage_metrics, success_metrics, engagement_score)
        
        customer = Customer(
            id=customer_id,
            company_name=company_name,
            contact_email=contact_email,
            current_tier=current_tier,
            monthly_spend=monthly_spend,
            contract_start_date=contract_start_date,
            contract_end_date=contract_end_date,
            usage_metrics=usage_metrics,
            engagement_score=engagement_score,
            success_metrics=success_metrics,
            last_activity_date=datetime.now().isoformat(),
            health_score=health_score
        )
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO customers
            (id, company_name, contact_email, current_tier, monthly_spend,
             contract_start_date, contract_end_date, usage_metrics, engagement_score,
             success_metrics, last_activity_date, health_score, created_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            customer.id, customer.company_name, customer.contact_email, customer.current_tier.value,
            customer.monthly_spend, customer.contract_start_date, customer.contract_end_date,
            json.dumps(customer.usage_metrics), customer.engagement_score,
            json.dumps(customer.success_metrics), customer.last_activity_date,
            customer.health_score, datetime.now().isoformat()
        ))
        
        conn.commit()
        conn.close()
        
        return customer_id
    
    def calculate_engagement_score(self, usage_metrics: Dict) -> int:
        """
        Calculate customer engagement score based on usage patterns
        """
        score = 0
        
        # Login frequency (0-25 points)
        monthly_logins = usage_metrics.get("monthly_logins", 0)
        score += min(25, monthly_logins * 2)
        
        # Feature adoption (0-25 points)
        features_used = usage_metrics.get("features_used", 0)
        total_features = usage_metrics.get("total_available_features", 20)
        adoption_rate = features_used / total_features if total_features > 0 else 0
        score += int(adoption_rate * 25)
        
        # Session duration (0-25 points)
        avg_session_minutes = usage_metrics.get("avg_session_minutes", 0)
        score += min(25, int(avg_session_minutes / 2))
        
        # Data/content creation (0-25 points)
        items_created = usage_metrics.get("items_created_monthly", 0)
        score += min(25, items_created)
        
        return min(100, score)
    
    def calculate_health_score(self, usage_metrics: Dict, success_metrics: Dict, engagement_score: int) -> int:
        """
        Calculate overall customer health score
        """
        score = 0
        
        # Engagement component (40% weight)
        score += engagement_score * 0.4
        
        # Success metrics component (35% weight)
        roi = success_metrics.get("roi_percentage", 0)
        satisfaction = success_metrics.get("satisfaction_score", 5)  # 1-10 scale
        
        roi_score = min(100, roi / 2)  # 200% ROI = 100 points
        satisfaction_score = satisfaction * 10  # Convert to 100-point scale
        
        score += (roi_score * 0.2 + satisfaction_score * 0.15)
        
        # Usage trend component (25% weight)
        usage_trend = usage_metrics.get("usage_trend", "stable")  # growing, stable, declining
        trend_scores = {"growing": 25, "stable": 15, "declining": 5}
        score += trend_scores.get(usage_trend, 15)
        
        return min(100, int(score))
    
    def analyze_upsell_opportunities(self, customer_id: str) -> List[UpsellOpportunity]:
        """
        Analyze customer profile and identify upsell opportunities
        """
        customer = self.get_customer_profile(customer_id)
        if not customer:
            return []
        
        opportunities = []
        
        for trigger in self.upsell_triggers:
            if not trigger.active:
                continue
            
            if self.evaluate_trigger_conditions(customer, trigger):
                # Calculate probability and urgency scores
                probability_score = self.calculate_probability_score(customer, trigger)
                urgency_score = self.calculate_urgency_score(customer, trigger)
                
                # Estimate opportunity value
                estimated_value = self.estimate_opportunity_value(customer, trigger)
                
                opportunity = UpsellOpportunity(
                    id=str(uuid.uuid4()),
                    customer_id=customer_id,
                    trigger_id=trigger.id,
                    opportunity_description=f"{trigger.trigger_name} for {customer.company_name}",
                    recommended_product=trigger.target_offer,
                    estimated_value=estimated_value,
                    probability_score=probability_score,
                    urgency_score=urgency_score,
                    status=UpsellStatus.IDENTIFIED,
                    created_date=datetime.now().isoformat(),
                    expires_date=(datetime.now() + timedelta(days=30)).isoformat(),
                    presentation_count=0,
                    last_presented_date=None
                )
                
                opportunities.append(opportunity)
        
        # Sort by priority (combination of probability, urgency, and value)
        opportunities.sort(key=lambda x: (x.probability_score * x.urgency_score * x.estimated_value), reverse=True)
        
        # Save opportunities to database
        for opp in opportunities:
            self.save_upsell_opportunity(opp)
        
        return opportunities
    
    def evaluate_trigger_conditions(self, customer: Customer, trigger: UpsellTrigger) -> bool:
        """
        Evaluate if customer meets trigger conditions
        """
        conditions = trigger.conditions
        
        if trigger.trigger_type == UpsellTriggerType.USAGE_THRESHOLD:
            usage_percentage = customer.usage_metrics.get("usage_percentage", 0)
            return usage_percentage >= conditions.get("usage_percentage", 100)
        
        elif trigger.trigger_type == UpsellTriggerType.FEATURE_ADOPTION:
            features_viewed = customer.usage_metrics.get("features_viewed", [])
            required_features = conditions.get("advanced_features_viewed", [])
            return len(set(features_viewed).intersection(set(required_features))) > 0
        
        elif trigger.trigger_type == UpsellTriggerType.SUCCESS_MILESTONE:
            roi = customer.success_metrics.get("roi_percentage", 0)
            satisfaction = customer.success_metrics.get("satisfaction_score", 0)
            return (roi >= conditions.get("roi_percentage", 200) and 
                   satisfaction >= conditions.get("satisfaction_score", 8))
        
        elif trigger.trigger_type == UpsellTriggerType.TIME_BASED:
            contract_end = datetime.fromisoformat(customer.contract_end_date)
            days_until_end = (contract_end - datetime.now()).days
            return (days_until_end <= conditions.get("days_until_renewal", 60) and
                   customer.health_score >= conditions.get("health_score_minimum", 7))
        
        elif trigger.trigger_type == UpsellTriggerType.ENGAGEMENT_SCORE:
            return customer.engagement_score >= conditions.get("engagement_score_minimum", 80)
        
        elif trigger.trigger_type == UpsellTriggerType.SUPPORT_INTERACTION:
            support_tickets = customer.usage_metrics.get("support_tickets_30d", [])
            keywords = conditions.get("support_ticket_keywords", [])
            matching_tickets = [ticket for ticket in support_tickets 
                              if any(keyword in ticket.lower() for keyword in keywords)]
            return len(matching_tickets) >= conditions.get("ticket_frequency", 3)
        
        return False
    
    def calculate_probability_score(self, customer: Customer, trigger: UpsellTrigger) -> float:
        """
        Calculate probability of upsell success
        """
        base_probability = trigger.success_rate
        
        # Adjust based on customer factors
        adjustments = 0.0
        
        # Health score adjustment
        if customer.health_score >= 80:
            adjustments += 0.15
        elif customer.health_score >= 60:
            adjustments += 0.05
        elif customer.health_score < 40:
            adjustments -= 0.20
        
        # Engagement score adjustment
        if customer.engagement_score >= 80:
            adjustments += 0.10
        elif customer.engagement_score < 50:
            adjustments -= 0.15
        
        # Tier adjustment (higher tiers more likely to upgrade)
        tier_multipliers = {
            CustomerTier.BASIC: 1.2,
            CustomerTier.PROFESSIONAL: 1.0,
            CustomerTier.ENTERPRISE: 0.8,
            CustomerTier.CUSTOM: 0.6
        }
        
        final_probability = (base_probability + adjustments) * tier_multipliers.get(customer.current_tier, 1.0)
        return min(1.0, max(0.1, final_probability))
    
    def calculate_urgency_score(self, customer: Customer, trigger: UpsellTrigger) -> int:
        """
        Calculate urgency score (1-10)
        """
        urgency = 5  # Base urgency
        
        # Contract renewal proximity
        if customer.contract_end_date:
            contract_end = datetime.fromisoformat(customer.contract_end_date)
            days_until_end = (contract_end - datetime.now()).days
            if days_until_end <= 30:
                urgency += 3
            elif days_until_end <= 60:
                urgency += 2
            elif days_until_end <= 90:
                urgency += 1
        
        # Usage threshold urgency
        usage_percentage = customer.usage_metrics.get("usage_percentage", 0)
        if usage_percentage >= 95:
            urgency += 3
        elif usage_percentage >= 85:
            urgency += 2
        elif usage_percentage >= 75:
            urgency += 1
        
        # Support ticket urgency
        recent_tickets = customer.usage_metrics.get("support_tickets_7d", 0)
        if recent_tickets >= 3:
            urgency += 2
        elif recent_tickets >= 1:
            urgency += 1
        
        return min(10, max(1, urgency))
    
    def estimate_opportunity_value(self, customer: Customer, trigger: UpsellTrigger) -> float:
        """
        Estimate the monetary value of the upsell opportunity
        """
        current_spend = customer.monthly_spend
        
        # Base value multipliers by offer type
        value_multipliers = {
            "next_tier_upgrade": 1.5,      # 50% increase
            "api_expansion_package": 0.3,   # 30% increase
            "professional_features_package": 0.8,  # 80% increase
            "enterprise_expansion": 2.5,    # 150% increase
            "renewal_with_upgrade": 1.2,    # 20% increase
            "premium_addon_bundle": 0.4,    # 40% increase
            "limitation_removal_package": 0.6  # 60% increase
        }
        
        base_value = current_spend * value_multipliers.get(trigger.target_offer, 1.0) * 12  # Annual value
        
        # Adjust based on customer characteristics
        if customer.success_metrics.get("roi_percentage", 0) >= 300:
            base_value *= 1.3  # High ROI customers likely to spend more
        
        if customer.current_tier == CustomerTier.ENTERPRISE:
            base_value *= 1.5  # Enterprise customers have higher deal values
        
        return round(base_value, 2)
    
    def create_upsell_campaign(self, opportunity_id: str, campaign_type: str = "email") -> str:
        """
        Create targeted upsell campaign for opportunity
        """
        opportunity = self.get_upsell_opportunity(opportunity_id)
        if not opportunity:
            return None
        
        customer = self.get_customer_profile(opportunity.customer_id)
        strategy = self.upsell_strategies.get(opportunity.recommended_product, {})
        
        # Generate personalized message
        message_content = self.generate_upsell_message(customer, opportunity, strategy, campaign_type)
        
        campaign = UpsellCampaign(
            id=str(uuid.uuid4()),
            opportunity_id=opportunity_id,
            campaign_type=campaign_type,
            message_content=message_content,
            call_to_action=self.generate_call_to_action(opportunity, strategy),
            sent_date=datetime.now().isoformat(),
            response_date=None,
            conversion_date=None,
            status="sent"
        )
        
        # Save campaign
        self.save_upsell_campaign(campaign)
        
        # Update opportunity presentation count
        self.update_opportunity_presentation(opportunity_id)
        
        return campaign.id
    
    def generate_upsell_message(self, customer: Customer, opportunity: UpsellOpportunity, 
                              strategy: Dict, campaign_type: str) -> str:
        """
        Generate personalized upsell message
        """
        if campaign_type == "email":
            return f"""Hi {customer.company_name} team,

I hope you're continuing to see great results with your current plan!

Based on your usage patterns and success metrics, I noticed you might benefit from our {strategy.get('title', 'upgrade option')}.

{strategy.get('value_proposition', 'This upgrade would unlock new capabilities for your team.')}

Here's what this means for {customer.company_name}:
• Eliminate current limitations you're experiencing
• Unlock advanced features that match your growth trajectory  
• Potential ROI increase of {int(opportunity.probability_score * 100)}% based on similar customers

Current monthly investment: ${customer.monthly_spend:,.2f}
Upgraded investment: ${customer.monthly_spend + (opportunity.estimated_value / 12):,.2f}
Additional monthly value: ${opportunity.estimated_value / 12:,.2f}

Worth a 15-minute conversation to explore this?

Best regards,
Kenneth"""
        
        elif campaign_type == "in_app":
            return f"""🚀 Ready to unlock your next level of growth?

Based on your success with our platform, you're an ideal candidate for {strategy.get('title', 'our premium features')}.

✓ Eliminate current limitations
✓ Access advanced capabilities
✓ Join customers seeing {int(opportunity.probability_score * 100)}%+ ROI improvements

Learn more about upgrading your plan."""
        
        return strategy.get('description', 'Upgrade opportunity available')
    
    def generate_call_to_action(self, opportunity: UpsellOpportunity, strategy: Dict) -> str:
        """
        Generate compelling call-to-action
        """
        cta_options = [
            "Schedule a 15-minute upgrade consultation",
            "See your personalized upgrade plan",
            "Unlock advanced features now",
            "Start your trial upgrade today",
            "Book a demo of premium features"
        ]
        
        # Choose CTA based on urgency and value
        if opportunity.urgency_score >= 8:
            return "Schedule urgent consultation - limited time offer"
        elif opportunity.estimated_value >= 50000:
            return "Book executive briefing on enterprise features"
        else:
            return cta_options[0]  # Default
    
    def get_customer_profile(self, customer_id: str) -> Optional[Customer]:
        """Get customer profile from database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM customers WHERE id = ?', (customer_id,))
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return Customer(
                id=result[0],
                company_name=result[1],
                contact_email=result[2],
                current_tier=CustomerTier(result[3]),
                monthly_spend=result[4],
                contract_start_date=result[5],
                contract_end_date=result[6],
                usage_metrics=json.loads(result[7]),
                engagement_score=result[8],
                success_metrics=json.loads(result[9]),
                last_activity_date=result[10],
                health_score=result[11]
            )
        
        return None
    
    def save_upsell_opportunity(self, opportunity: UpsellOpportunity):
        """Save upsell opportunity to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO upsell_opportunities
            (id, customer_id, trigger_id, opportunity_description, recommended_product,
             estimated_value, probability_score, urgency_score, status, created_date,
             expires_date, presentation_count, last_presented_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            opportunity.id, opportunity.customer_id, opportunity.trigger_id,
            opportunity.opportunity_description, opportunity.recommended_product,
            opportunity.estimated_value, opportunity.probability_score, opportunity.urgency_score,
            opportunity.status.value, opportunity.created_date, opportunity.expires_date,
            opportunity.presentation_count, opportunity.last_presented_date
        ))
        
        conn.commit()
        conn.close()
    
    def get_upsell_opportunity(self, opportunity_id: str) -> Optional[UpsellOpportunity]:
        """Get upsell opportunity from database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM upsell_opportunities WHERE id = ?', (opportunity_id,))
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return UpsellOpportunity(
                id=result[0],
                customer_id=result[1],
                trigger_id=result[2],
                opportunity_description=result[3],
                recommended_product=result[4],
                estimated_value=result[5],
                probability_score=result[6],
                urgency_score=result[7],
                status=UpsellStatus(result[8]),
                created_date=result[9],
                expires_date=result[10],
                presentation_count=result[11],
                last_presented_date=result[12]
            )
        
        return None
    
    def save_upsell_campaign(self, campaign: UpsellCampaign):
        """Save upsell campaign to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO upsell_campaigns
            (id, opportunity_id, campaign_type, message_content, call_to_action,
             sent_date, response_date, conversion_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            campaign.id, campaign.opportunity_id, campaign.campaign_type,
            campaign.message_content, campaign.call_to_action, campaign.sent_date,
            campaign.response_date, campaign.conversion_date, campaign.status
        ))
        
        conn.commit()
        conn.close()
    
    def update_opportunity_presentation(self, opportunity_id: str):
        """Update opportunity presentation count and date"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE upsell_opportunities
            SET presentation_count = presentation_count + 1,
                last_presented_date = ?,
                status = 'presented'
            WHERE id = ?
        ''', (datetime.now().isoformat(), opportunity_id))
        
        conn.commit()
        conn.close()
    
    def generate_upselling_report(self, start_date: str, end_date: str) -> Dict:
        """Generate comprehensive upselling performance report"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Overall metrics
        cursor.execute('''
            SELECT 
                COUNT(*) as total_opportunities,
                COUNT(CASE WHEN status = 'accepted' THEN 1 END) as converted_opportunities,
                COALESCE(SUM(CASE WHEN status = 'accepted' THEN estimated_value END), 0) as total_revenue,
                AVG(probability_score) as avg_probability,
                AVG(urgency_score) as avg_urgency
            FROM upsell_opportunities
            WHERE created_date BETWEEN ? AND ?
        ''', (start_date, end_date))
        
        overall_metrics = cursor.fetchone()
        
        # Performance by trigger type
        cursor.execute('''
            SELECT 
                ut.trigger_type,
                COUNT(uo.id) as opportunities_created,
                COUNT(CASE WHEN uo.status = 'accepted' THEN 1 END) as conversions,
                COALESCE(SUM(CASE WHEN uo.status = 'accepted' THEN uo.estimated_value END), 0) as revenue
            FROM upsell_opportunities uo
            JOIN upsell_triggers ut ON uo.trigger_id = ut.id
            WHERE uo.created_date BETWEEN ? AND ?
            GROUP BY ut.trigger_type
        ''', (start_date, end_date))
        
        trigger_performance = cursor.fetchall()
        
        # Top performing opportunities
        cursor.execute('''
            SELECT 
                c.company_name,
                uo.recommended_product,
                uo.estimated_value,
                uo.probability_score,
                uo.status
            FROM upsell_opportunities uo
            JOIN customers c ON uo.customer_id = c.id
            WHERE uo.created_date BETWEEN ? AND ?
            ORDER BY uo.estimated_value DESC
            LIMIT 10
        ''', (start_date, end_date))
        
        top_opportunities = cursor.fetchall()
        
        conn.close()
        
        return {
            "report_period": f"{start_date} to {end_date}",
            "overall_metrics": {
                "total_opportunities": overall_metrics[0],
                "conversion_rate": round((overall_metrics[1] / overall_metrics[0]) * 100, 2) if overall_metrics[0] > 0 else 0,
                "total_revenue": overall_metrics[2],
                "avg_probability": round(overall_metrics[3], 2) if overall_metrics[3] else 0,
                "avg_urgency": round(overall_metrics[4], 2) if overall_metrics[4] else 0
            },
            "trigger_performance": [
                {
                    "trigger_type": trigger[0],
                    "opportunities": trigger[1],
                    "conversions": trigger[2],
                    "conversion_rate": round((trigger[2] / trigger[1]) * 100, 2) if trigger[1] > 0 else 0,
                    "revenue": trigger[3]
                }
                for trigger in trigger_performance
            ],
            "top_opportunities": [
                {
                    "company": opp[0],
                    "product": opp[1],
                    "value": opp[2],
                    "probability": opp[3],
                    "status": opp[4]
                }
                for opp in top_opportunities
            ]
        }

def main():
    """
    Example usage of automated upselling system
    """
    upselling_system = AutomatedUpsellingSystem()
    
    # Create sample customer profiles
    customers = [
        {
            "company_name": "TechCorp Solutions",
            "contact_email": "admin@techcorp.com",
            "current_tier": CustomerTier.PROFESSIONAL,
            "monthly_spend": 2500.0,
            "contract_start_date": "2024-01-15",
            "contract_end_date": "2024-12-15",
            "usage_metrics": {
                "usage_percentage": 85,
                "monthly_logins": 45,
                "features_used": 18,
                "total_available_features": 25,
                "avg_session_minutes": 35,
                "items_created_monthly": 120,
                "features_viewed": ["automation_builder", "advanced_analytics"],
                "api_usage_percentage": 92,
                "usage_trend": "growing"
            },
            "success_metrics": {
                "roi_percentage": 250,
                "satisfaction_score": 9
            }
        },
        {
            "company_name": "GrowthMax Inc",
            "contact_email": "team@growthmax.com",
            "current_tier": CustomerTier.BASIC,
            "monthly_spend": 899.0,
            "contract_start_date": "2024-03-01",
            "contract_end_date": "2025-03-01",
            "usage_metrics": {
                "usage_percentage": 95,
                "monthly_logins": 60,
                "features_used": 8,
                "total_available_features": 15,
                "avg_session_minutes": 45,
                "items_created_monthly": 200,
                "support_tickets_30d": ["Need more API calls", "Upgrade options"],
                "usage_trend": "growing"
            },
            "success_metrics": {
                "roi_percentage": 180,
                "satisfaction_score": 8
            }
        }
    ]
    
    customer_ids = []
    for customer_data in customers:
        customer_id = upselling_system.create_customer_profile(
            customer_data["company_name"],
            customer_data["contact_email"],
            customer_data["current_tier"],
            customer_data["monthly_spend"],
            customer_data["contract_start_date"],
            customer_data["contract_end_date"],
            customer_data["usage_metrics"],
            customer_data["success_metrics"]
        )
        customer_ids.append(customer_id)
        print(f"Created customer profile: {customer_data['company_name']} (ID: {customer_id})")
    
    # Analyze upsell opportunities
    for customer_id in customer_ids:
        opportunities = upselling_system.analyze_upsell_opportunities(customer_id)
        customer = upselling_system.get_customer_profile(customer_id)
        
        print(f"\nUpsell opportunities for {customer.company_name}:")
        for opp in opportunities[:3]:  # Show top 3 opportunities
            print(f"  - {opp.opportunity_description}")
            print(f"    Product: {opp.recommended_product}")
            print(f"    Value: ${opp.estimated_value:,.2f}")
            print(f"    Probability: {opp.probability_score:.2%}")
            print(f"    Urgency: {opp.urgency_score}/10")
            
            # Create campaign for top opportunity
            if opp == opportunities[0]:
                campaign_id = upselling_system.create_upsell_campaign(opp.id, "email")
                print(f"    Campaign created: {campaign_id}")
    
    # Generate report
    report = upselling_system.generate_upselling_report("2024-01-01", "2024-12-31")
    print(f"\nUpselling Report: {json.dumps(report, indent=2)}")

if __name__ == "__main__":
    main()