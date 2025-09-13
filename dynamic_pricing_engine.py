#!/usr/bin/env python3
"""
Dynamic Pricing Engine Based on Client Value
AI-powered pricing optimization system that adjusts prices based on client characteristics and market conditions
"""

import json
import sqlite3
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Any, Tuple
# import numpy as np  # Removed for testing
import uuid
from enum import Enum
import math

class PricingTier(Enum):
    BASIC = "basic"
    STANDARD = "standard"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"
    CUSTOM = "custom"

class ClientSegment(Enum):
    STARTUP = "startup"
    SMB = "smb"
    MID_MARKET = "mid_market"
    ENTERPRISE = "enterprise"
    FORTUNE_500 = "fortune_500"

@dataclass
class ClientProfile:
    id: str
    company_name: str
    industry: str
    company_size: int
    annual_revenue: float
    funding_stage: str
    urgency_score: int  # 1-10
    competition_level: int  # 1-10
    strategic_value: int  # 1-10
    payment_history_score: int  # 1-10
    relationship_strength: int  # 1-10
    geographic_location: str
    segment: ClientSegment

@dataclass
class PricingModel:
    id: str
    model_name: str
    base_price: float
    pricing_factors: Dict[str, float]
    discount_bands: Dict[str, float]
    premium_multipliers: Dict[str, float]
    active: bool
    created_date: str

@dataclass
class PriceQuote:
    id: str
    client_id: str
    product_service: str
    base_price: float
    calculated_price: float
    discount_percentage: float
    premium_multiplier: float
    pricing_factors_applied: Dict[str, float]
    valid_until: str
    status: str  # draft, sent, accepted, expired, declined
    created_date: str

class DynamicPricingEngine:
    def __init__(self, db_path="dynamic_pricing.db"):
        self.db_path = db_path
        self.init_database()
        self.pricing_models = self.load_pricing_models()
        self.market_conditions = self.get_current_market_conditions()
        self.features_comparison = self.load_features_comparison()
    
    def init_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS client_profiles (
                id TEXT PRIMARY KEY,
                company_name TEXT,
                industry TEXT,
                company_size INTEGER,
                annual_revenue REAL,
                funding_stage TEXT,
                urgency_score INTEGER,
                competition_level INTEGER,
                strategic_value INTEGER,
                payment_history_score INTEGER,
                relationship_strength INTEGER,
                geographic_location TEXT,
                segment TEXT,
                created_date TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS pricing_models (
                id TEXT PRIMARY KEY,
                model_name TEXT,
                base_price REAL,
                pricing_factors TEXT,
                discount_bands TEXT,
                premium_multipliers TEXT,
                active BOOLEAN,
                created_date TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS price_quotes (
                id TEXT PRIMARY KEY,
                client_id TEXT,
                product_service TEXT,
                base_price REAL,
                calculated_price REAL,
                discount_percentage REAL,
                premium_multiplier REAL,
                pricing_factors_applied TEXT,
                valid_until TEXT,
                status TEXT,
                created_date TEXT,
                FOREIGN KEY (client_id) REFERENCES client_profiles (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS pricing_analytics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                quote_id TEXT,
                client_segment TEXT,
                original_price REAL,
                final_price REAL,
                conversion_rate REAL,
                revenue_impact REAL,
                recorded_date TEXT,
                FOREIGN KEY (quote_id) REFERENCES price_quotes (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def load_pricing_models(self) -> Dict[str, PricingModel]:
        """
        Load predefined pricing models with different strategies
        """
        models = {}
        
        # Value-based pricing model
        models["value_based"] = PricingModel(
            id="value_based",
            model_name="Value-Based Pricing",
            base_price=10000.0,
            pricing_factors={
                # Company size factors
                "company_size_multiplier": {
                    "startup": 0.7,      # 30% discount for startups
                    "smb": 0.85,         # 15% discount for SMBs
                    "mid_market": 1.0,   # Base price
                    "enterprise": 1.5,   # 50% premium
                    "fortune_500": 2.5   # 150% premium
                },
                # Industry factors
                "industry_multiplier": {
                    "technology": 1.2,
                    "saas": 1.3,
                    "fintech": 1.4,
                    "healthcare": 1.1,
                    "manufacturing": 0.9,
                    "retail": 0.8,
                    "non_profit": 0.6
                },
                # Urgency premium
                "urgency_premium": {
                    "1-3": 0.9,   # Low urgency = discount
                    "4-6": 1.0,   # Medium urgency = base
                    "7-8": 1.15,  # High urgency = 15% premium
                    "9-10": 1.3   # Critical urgency = 30% premium
                },
                # Competition adjustment
                "competition_adjustment": {
                    "1-3": 1.2,   # Low competition = premium
                    "4-6": 1.0,   # Medium competition = base
                    "7-10": 0.85  # High competition = discount
                },
                # Strategic value multiplier
                "strategic_multiplier": {
                    "1-3": 0.9,   # Low strategic value
                    "4-6": 1.0,   # Medium strategic value
                    "7-8": 1.1,   # High strategic value
                    "9-10": 1.25  # Critical strategic value
                }
            },
            discount_bands={
                "volume_discount": {
                    "threshold_1": {"min_revenue": 100000, "discount": 0.05},
                    "threshold_2": {"min_revenue": 500000, "discount": 0.10},
                    "threshold_3": {"min_revenue": 1000000, "discount": 0.15}
                },
                "relationship_discount": {
                    "new_client": 0.0,
                    "existing_client": 0.05,
                    "long_term_client": 0.10,
                    "strategic_partner": 0.15
                }
            },
            premium_multipliers={
                "rush_delivery": 1.25,
                "custom_requirements": 1.15,
                "white_glove_service": 1.35,
                "exclusive_access": 1.5
            },
            active=True,
            created_date=datetime.now().isoformat()
        )
        
        # Competitive pricing model
        models["competitive"] = PricingModel(
            id="competitive",
            model_name="Competitive Pricing",
            base_price=8500.0,
            pricing_factors={
                "market_position": {
                    "price_leader": 1.3,
                    "price_matcher": 1.0,
                    "price_follower": 0.85
                },
                "differentiation_premium": {
                    "commodity": 0.9,
                    "differentiated": 1.1,
                    "unique_value": 1.25
                }
            },
            discount_bands={
                "competitive_match": {
                    "beat_competitor": 0.95,
                    "match_competitor": 1.0,
                    "premium_justified": 1.15
                }
            },
            premium_multipliers={
                "superior_quality": 1.2,
                "faster_delivery": 1.15,
                "better_support": 1.1
            },
            active=True,
            created_date=datetime.now().isoformat()
        )
        
        # Psychological pricing model
        models["psychological"] = PricingModel(
            id="psychological",
            model_name="Psychological Pricing",
            base_price=9999.0,  # Price anchoring
            pricing_factors={
                "price_sensitivity": {
                    "low_sensitivity": 1.2,
                    "medium_sensitivity": 1.0,
                    "high_sensitivity": 0.85
                },
                "reference_price": {
                    "above_reference": 0.95,
                    "at_reference": 1.0,
                    "below_reference": 1.05
                }
            },
            discount_bands={
                "bundle_discount": {
                    "single_service": 1.0,
                    "package_deal": 0.90,
                    "full_suite": 0.80
                }
            },
            premium_multipliers={
                "premium_positioning": 1.3,
                "exclusive_offering": 1.4,
                "limited_availability": 1.25
            },
            active=True,
            created_date=datetime.now().isoformat()
        )
        
        return models
    
    def get_current_market_conditions(self) -> Dict[str, float]:
        """
        Get current market conditions that affect pricing
        """
        # In a real implementation, this would pull from market data APIs
        return {
            "demand_index": 1.15,        # High demand = price increase
            "supply_constraint": 1.08,   # Limited supply = price increase  
            "economic_indicator": 0.95,  # Economic downturn = price decrease
            "seasonal_factor": 1.05,     # Peak season = price increase
            "competitive_pressure": 0.92 # High competition = price decrease
        }
    
    def load_features_comparison(self) -> Dict[str, Any]:
        """
        Why Businesses Choose Our AI Automation
        Compare manual support vs our AI-powered solution
        """
        return {
            "section_title": "Why Businesses Choose Our AI Automation",
            "subtitle": "Compare manual support vs our AI-powered solution",
            
            "before_after_comparison": {
                "manual_support": {
                    "title": "Manual Support",
                    "theme_color": "red_tinted",
                    "disadvantages": [
                        {"icon": "❌", "text": "4-6 hour response times", "impact": "Customer frustration and lost sales"},
                        {"icon": "❌", "text": "High staff costs ($12,000+/month)", "impact": "Significant operational overhead"},
                        {"icon": "❌", "text": "Limited to business hours only", "impact": "Miss opportunities outside 9-5"},
                        {"icon": "❌", "text": "Inconsistent answers", "impact": "Brand confusion and customer dissatisfaction"},
                        {"icon": "❌", "text": "Staff burnout and turnover", "impact": "Constant hiring and training costs"},
                        {"icon": "❌", "text": "Scales poorly with growth", "impact": "Performance degrades as volume increases"}
                    ]
                },
                "ai_powered_support": {
                    "title": "AI-Powered Support", 
                    "theme_color": "green_tinted",
                    "advantages": [
                        {"icon": "✅", "text": "30-second response times", "impact": "Instant customer satisfaction and higher conversions"},
                        {"icon": "✅", "text": "Predictable costs ($2,500+/month)", "impact": "70% cost savings with transparent pricing"},
                        {"icon": "✅", "text": "24/7/365 availability", "impact": "Capture every opportunity, never miss a lead"},
                        {"icon": "✅", "text": "Consistent, accurate responses", "impact": "Professional brand image across all interactions"},
                        {"icon": "✅", "text": "Happy, focused human agents", "impact": "Team handles complex issues while AI handles routine"},
                        {"icon": "✅", "text": "Scales infinitely with your growth", "impact": "Performance improves as volume increases"}
                    ]
                }
            },
            
            "key_features_grid": {
                "layout": "3x2",
                "features": [
                    {
                        "icon": "🤖",
                        "title": "Intelligent AI Agent",
                        "description": "Handles 80% of inquiries with human-like responses trained on your business knowledge",
                        "key_benefits": [
                            "Natural language understanding",
                            "Context-aware responses", 
                            "Learns from interactions",
                            "Branded personality"
                        ],
                        "roi_metric": "80% inquiry resolution rate"
                    },
                    {
                        "icon": "⚡",
                        "title": "Lightning Fast Setup",
                        "description": "Live in 24 hours with full integration to your existing tools and workflows",
                        "key_benefits": [
                            "Pre-built integrations",
                            "One-click deployment",
                            "Automated data migration",
                            "Dedicated onboarding specialist"
                        ],
                        "roi_metric": "24-hour implementation"
                    },
                    {
                        "icon": "🔄", 
                        "title": "Multi-Channel Support",
                        "description": "Works across email, chat, social media, and phone - all from one unified system",
                        "key_benefits": [
                            "Unified inbox management",
                            "Cross-channel conversation tracking",
                            "Omnichannel customer journey",
                            "Single source of truth"
                        ],
                        "roi_metric": "5+ channels supported"
                    },
                    {
                        "icon": "📊",
                        "title": "Real-Time Analytics", 
                        "description": "Track savings, response times, and customer satisfaction with detailed reporting",
                        "key_benefits": [
                            "Live performance dashboards",
                            "ROI tracking and reporting",
                            "Customer satisfaction metrics",
                            "Operational efficiency insights"
                        ],
                        "roi_metric": "Real-time ROI visibility"
                    },
                    {
                        "icon": "🛡️",
                        "title": "Enterprise Security",
                        "description": "SOC 2 compliant with end-to-end encryption and full audit trails",
                        "key_benefits": [
                            "SOC 2 Type II certified",
                            "256-bit encryption",
                            "Complete audit logs",
                            "GDPR & CCPA compliant"
                        ],
                        "roi_metric": "Bank-level security"
                    },
                    {
                        "icon": "🎯",
                        "title": "Custom Training",
                        "description": "AI learns your business, tone, and processes for perfectly branded interactions", 
                        "key_benefits": [
                            "Custom knowledge base",
                            "Brand voice training",
                            "Process automation",
                            "Continuous learning"
                        ],
                        "roi_metric": "100% brand consistency"
                    }
                ]
            },
            
            "competitive_advantages": {
                "title": "Our Competitive Edge",
                "advantages": [
                    {
                        "category": "Performance",
                        "metrics": [
                            {"metric": "Response Time", "us": "30 seconds", "competitors": "4-6 hours", "improvement": "720x faster"},
                            {"metric": "Availability", "us": "24/7/365", "competitors": "Business hours", "improvement": "3x coverage"},
                            {"metric": "Accuracy Rate", "us": "98%+", "competitors": "75-85%", "improvement": "15-23% better"}
                        ]
                    },
                    {
                        "category": "Cost Efficiency", 
                        "metrics": [
                            {"metric": "Monthly Cost", "us": "$2,500+", "competitors": "$12,000+", "improvement": "79% savings"},
                            {"metric": "Setup Time", "us": "24 hours", "competitors": "2-8 weeks", "improvement": "14-56x faster"},
                            {"metric": "Training Required", "us": "Minimal", "competitors": "Extensive", "improvement": "90% less effort"}
                        ]
                    },
                    {
                        "category": "Scalability",
                        "metrics": [
                            {"metric": "Volume Handling", "us": "Unlimited", "competitors": "Limited by staff", "improvement": "Infinite scale"},
                            {"metric": "Peak Load Performance", "us": "Consistent", "competitors": "Degrades", "improvement": "100% reliability"},
                            {"metric": "Multi-language Support", "us": "100+ languages", "competitors": "2-5 languages", "improvement": "20-50x coverage"}
                        ]
                    }
                ]
            },
            
            "social_proof": {
                "title": "Trusted by Leading Companies",
                "testimonials": [
                    {
                        "company": "TechCorp Solutions",
                        "industry": "SaaS", 
                        "company_size": "500+ employees",
                        "quote": "Reduced our customer service costs by 75% while improving response times from 6 hours to 30 seconds. Game changer.",
                        "author": "Sarah Johnson",
                        "title": "VP of Customer Success",
                        "results": {
                            "cost_savings": "75%",
                            "response_time_improvement": "720x faster", 
                            "customer_satisfaction": "+40%"
                        }
                    },
                    {
                        "company": "GrowthMax Inc",
                        "industry": "E-commerce",
                        "company_size": "200+ employees", 
                        "quote": "Our AI agent handles complex product inquiries better than our human agents did. Customer satisfaction is at an all-time high.",
                        "author": "Mike Chen",
                        "title": "CEO",
                        "results": {
                            "inquiry_resolution": "95%",
                            "customer_satisfaction": "+60%",
                            "team_productivity": "+200%"
                        }
                    },
                    {
                        "company": "InnovateNow",
                        "industry": "Consulting", 
                        "company_size": "100+ employees",
                        "quote": "Implementation took exactly 24 hours. ROI was positive within the first week. Incredible technology.",
                        "author": "Lisa Wang",
                        "title": "COO",
                        "results": {
                            "implementation_time": "24 hours",
                            "roi_timeline": "1 week",
                            "operational_efficiency": "+300%"
                        }
                    }
                ]
            },
            
            "roi_calculator": {
                "title": "Calculate Your ROI",
                "description": "See how much you could save with AI automation",
                "input_fields": [
                    {"field": "current_monthly_support_cost", "label": "Current Monthly Support Cost", "placeholder": "$12,000", "type": "currency"},
                    {"field": "support_tickets_per_month", "label": "Support Tickets per Month", "placeholder": "1,500", "type": "number"},
                    {"field": "average_response_time_hours", "label": "Current Average Response Time (hours)", "placeholder": "4.5", "type": "number"},
                    {"field": "customer_satisfaction_score", "label": "Current Customer Satisfaction (1-10)", "placeholder": "7", "type": "rating"}
                ],
                "calculation_logic": {
                    "ai_monthly_cost": "base_cost + (tickets_per_month * 0.50)",
                    "monthly_savings": "current_cost - ai_monthly_cost", 
                    "annual_savings": "monthly_savings * 12",
                    "roi_percentage": "(annual_savings / (ai_monthly_cost * 12)) * 100",
                    "payback_period_months": "(ai_monthly_cost * 12) / monthly_savings"
                },
                "sample_results": {
                    "monthly_savings": "$9,500",
                    "annual_savings": "$114,000",
                    "roi_percentage": "380%",
                    "payback_period": "0.3 months"
                }
            },
            
            "implementation_roadmap": {
                "title": "Your 24-Hour Implementation Roadmap",
                "phases": [
                    {
                        "phase": "Hour 1-4: Discovery & Setup",
                        "activities": [
                            "Initial consultation call",
                            "System requirements analysis", 
                            "API key generation and access setup",
                            "Data security and compliance review"
                        ],
                        "deliverables": ["Technical requirements document", "Security compliance checklist"]
                    },
                    {
                        "phase": "Hour 5-12: Integration & Training", 
                        "activities": [
                            "Connect existing tools and databases",
                            "Import historical conversation data",
                            "AI training on your business knowledge",
                            "Brand voice and tone calibration"
                        ],
                        "deliverables": ["Integrated system", "Trained AI agent", "Brand voice profile"]
                    },
                    {
                        "phase": "Hour 13-20: Testing & Optimization",
                        "activities": [
                            "Comprehensive system testing",
                            "Performance optimization",
                            "Edge case handling setup", 
                            "Fallback procedures configuration"
                        ],
                        "deliverables": ["Test results report", "Optimized configuration", "QA checklist"]
                    },
                    {
                        "phase": "Hour 21-24: Launch & Support",
                        "activities": [
                            "Soft launch with monitoring",
                            "Team training session",
                            "Performance metrics baseline",
                            "24/7 support channel activation"
                        ],
                        "deliverables": ["Live system", "Trained team", "Support documentation", "Performance dashboard"]
                    }
                ]
            },
            
            "bottom_text": "Everything you need to transform customer service, nothing you don't.",
            
            "call_to_action": {
                "primary": {
                    "text": "Start Your 24-Hour Implementation",
                    "action": "book_implementation_call",
                    "urgency": "Limited spots available this month"
                },
                "secondary": {
                    "text": "Calculate Your ROI", 
                    "action": "open_roi_calculator",
                    "description": "See your potential savings in 60 seconds"
                }
            }
        }
    
    def create_client_profile(self, company_name: str, industry: str, company_size: int,
                            annual_revenue: float, funding_stage: str, urgency_score: int,
                            competition_level: int, strategic_value: int, 
                            payment_history_score: int, relationship_strength: int,
                            geographic_location: str) -> str:
        """
        Create comprehensive client profile for pricing analysis
        """
        client_id = str(uuid.uuid4())
        
        # Determine client segment based on company characteristics
        segment = self.determine_client_segment(company_size, annual_revenue, funding_stage)
        
        profile = ClientProfile(
            id=client_id,
            company_name=company_name,
            industry=industry,
            company_size=company_size,
            annual_revenue=annual_revenue,
            funding_stage=funding_stage,
            urgency_score=urgency_score,
            competition_level=competition_level,
            strategic_value=strategic_value,
            payment_history_score=payment_history_score,
            relationship_strength=relationship_strength,
            geographic_location=geographic_location,
            segment=segment
        )
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO client_profiles
            (id, company_name, industry, company_size, annual_revenue, funding_stage,
             urgency_score, competition_level, strategic_value, payment_history_score,
             relationship_strength, geographic_location, segment, created_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            profile.id, profile.company_name, profile.industry, profile.company_size,
            profile.annual_revenue, profile.funding_stage, profile.urgency_score,
            profile.competition_level, profile.strategic_value, profile.payment_history_score,
            profile.relationship_strength, profile.geographic_location, profile.segment.value,
            datetime.now().isoformat()
        ))
        
        conn.commit()
        conn.close()
        
        return client_id
    
    def determine_client_segment(self, company_size: int, annual_revenue: float, 
                               funding_stage: str) -> ClientSegment:
        """
        Determine client segment based on company characteristics
        """
        if annual_revenue >= 10000000000:  # $10B+
            return ClientSegment.FORTUNE_500
        elif annual_revenue >= 1000000000 or company_size >= 10000:  # $1B+ or 10K+ employees
            return ClientSegment.ENTERPRISE
        elif annual_revenue >= 100000000 or company_size >= 1000:  # $100M+ or 1K+ employees
            return ClientSegment.MID_MARKET
        elif annual_revenue >= 10000000 or company_size >= 100:  # $10M+ or 100+ employees
            return ClientSegment.SMB
        else:
            return ClientSegment.STARTUP
    
    def calculate_dynamic_price(self, client_id: str, product_service: str, 
                              pricing_model: str = "value_based", 
                              additional_factors: Optional[Dict] = None) -> PriceQuote:
        """
        Calculate dynamic price based on client profile and market conditions
        """
        # Get client profile
        client = self.get_client_profile(client_id)
        if not client:
            raise ValueError("Client profile not found")
        
        # Get pricing model
        model = self.pricing_models.get(pricing_model)
        if not model:
            raise ValueError("Pricing model not found")
        
        # Start with base price
        calculated_price = model.base_price
        applied_factors = {}
        
        # Apply company segment multiplier
        if client.segment.value in model.pricing_factors.get("company_size_multiplier", {}):
            segment_multiplier = model.pricing_factors["company_size_multiplier"][client.segment.value]
            calculated_price *= segment_multiplier
            applied_factors["segment_multiplier"] = segment_multiplier
        
        # Apply industry multiplier
        industry_key = client.industry.lower().replace(" ", "_")
        if industry_key in model.pricing_factors.get("industry_multiplier", {}):
            industry_multiplier = model.pricing_factors["industry_multiplier"][industry_key]
            calculated_price *= industry_multiplier
            applied_factors["industry_multiplier"] = industry_multiplier
        
        # Apply urgency premium
        urgency_band = self.get_urgency_band(client.urgency_score)
        if urgency_band in model.pricing_factors.get("urgency_premium", {}):
            urgency_multiplier = model.pricing_factors["urgency_premium"][urgency_band]
            calculated_price *= urgency_multiplier
            applied_factors["urgency_multiplier"] = urgency_multiplier
        
        # Apply competition adjustment
        competition_band = self.get_competition_band(client.competition_level)
        if competition_band in model.pricing_factors.get("competition_adjustment", {}):
            competition_multiplier = model.pricing_factors["competition_adjustment"][competition_band]
            calculated_price *= competition_multiplier
            applied_factors["competition_multiplier"] = competition_multiplier
        
        # Apply strategic value multiplier
        strategic_band = self.get_strategic_band(client.strategic_value)
        if strategic_band in model.pricing_factors.get("strategic_multiplier", {}):
            strategic_multiplier = model.pricing_factors["strategic_multiplier"][strategic_band]
            calculated_price *= strategic_multiplier
            applied_factors["strategic_multiplier"] = strategic_multiplier
        
        # Apply volume discounts
        volume_discount = self.calculate_volume_discount(client.annual_revenue, model.discount_bands)
        if volume_discount > 0:
            calculated_price *= (1 - volume_discount)
            applied_factors["volume_discount"] = volume_discount
        
        # Apply relationship discount
        relationship_discount = self.calculate_relationship_discount(client.relationship_strength)
        if relationship_discount > 0:
            calculated_price *= (1 - relationship_discount)
            applied_factors["relationship_discount"] = relationship_discount
        
        # Apply market condition adjustments
        for condition, multiplier in self.market_conditions.items():
            calculated_price *= multiplier
            applied_factors[f"market_{condition}"] = multiplier
        
        # Apply additional premium factors if specified
        premium_multiplier = 1.0
        if additional_factors:
            for factor, active in additional_factors.items():
                if active and factor in model.premium_multipliers:
                    premium_multiplier *= model.premium_multipliers[factor]
                    applied_factors[f"premium_{factor}"] = model.premium_multipliers[factor]
        
        calculated_price *= premium_multiplier
        
        # Apply psychological pricing adjustments
        calculated_price = self.apply_psychological_pricing(calculated_price, client)
        
        # Calculate discount percentage
        discount_percentage = max(0, (model.base_price - calculated_price) / model.base_price * 100)
        
        # Create price quote
        quote_id = str(uuid.uuid4())
        quote = PriceQuote(
            id=quote_id,
            client_id=client_id,
            product_service=product_service,
            base_price=model.base_price,
            calculated_price=round(calculated_price, 2),
            discount_percentage=round(discount_percentage, 2),
            premium_multiplier=premium_multiplier,
            pricing_factors_applied=applied_factors,
            valid_until=(datetime.now() + timedelta(days=30)).isoformat(),
            status="draft",
            created_date=datetime.now().isoformat()
        )
        
        # Save quote to database
        self.save_price_quote(quote)
        
        return quote
    
    def get_urgency_band(self, urgency_score: int) -> str:
        """Convert urgency score to band"""
        if urgency_score <= 3:
            return "1-3"
        elif urgency_score <= 6:
            return "4-6"
        elif urgency_score <= 8:
            return "7-8"
        else:
            return "9-10"
    
    def get_competition_band(self, competition_level: int) -> str:
        """Convert competition level to band"""
        if competition_level <= 3:
            return "1-3"
        elif competition_level <= 6:
            return "4-6"
        else:
            return "7-10"
    
    def get_strategic_band(self, strategic_value: int) -> str:
        """Convert strategic value to band"""
        if strategic_value <= 3:
            return "1-3"
        elif strategic_value <= 6:
            return "4-6"
        elif strategic_value <= 8:
            return "7-8"
        else:
            return "9-10"
    
    def calculate_volume_discount(self, annual_revenue: float, discount_bands: Dict) -> float:
        """Calculate volume discount based on client revenue"""
        volume_discounts = discount_bands.get("volume_discount", {})
        
        applicable_discount = 0.0
        for threshold_name, threshold_data in volume_discounts.items():
            if annual_revenue >= threshold_data["min_revenue"]:
                applicable_discount = max(applicable_discount, threshold_data["discount"])
        
        return applicable_discount
    
    def calculate_relationship_discount(self, relationship_strength: int) -> float:
        """Calculate relationship-based discount"""
        if relationship_strength >= 9:
            return 0.15  # Strategic partner
        elif relationship_strength >= 7:
            return 0.10  # Long-term client
        elif relationship_strength >= 5:
            return 0.05  # Existing client
        else:
            return 0.0   # New client
    
    def apply_psychological_pricing(self, price: float, client: ClientProfile) -> float:
        """Apply psychological pricing strategies"""
        # Price anchoring - end with 9 or 99
        if price >= 1000:
            # Round to nearest hundred, subtract 1
            anchored_price = math.ceil(price / 100) * 100 - 1
        else:
            # Round to nearest ten, subtract 1
            anchored_price = math.ceil(price / 10) * 10 - 1
        
        # For enterprise clients, round to cleaner numbers
        if client.segment in [ClientSegment.ENTERPRISE, ClientSegment.FORTUNE_500]:
            anchored_price = round(price / 1000) * 1000
        
        return anchored_price
    
    def get_client_profile(self, client_id: str) -> Optional[ClientProfile]:
        """Get client profile from database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM client_profiles WHERE id = ?', (client_id,))
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return ClientProfile(
                id=result[0],
                company_name=result[1],
                industry=result[2],
                company_size=result[3],
                annual_revenue=result[4],
                funding_stage=result[5],
                urgency_score=result[6],
                competition_level=result[7],
                strategic_value=result[8],
                payment_history_score=result[9],
                relationship_strength=result[10],
                geographic_location=result[11],
                segment=ClientSegment(result[12])
            )
        
        return None
    
    def save_price_quote(self, quote: PriceQuote):
        """Save price quote to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO price_quotes
            (id, client_id, product_service, base_price, calculated_price,
             discount_percentage, premium_multiplier, pricing_factors_applied,
             valid_until, status, created_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            quote.id, quote.client_id, quote.product_service, quote.base_price,
            quote.calculated_price, quote.discount_percentage, quote.premium_multiplier,
            json.dumps(quote.pricing_factors_applied), quote.valid_until,
            quote.status, quote.created_date
        ))
        
        conn.commit()
        conn.close()
    
    def optimize_pricing_model(self, model_name: str, performance_data: List[Dict]) -> Dict:
        """
        Use machine learning to optimize pricing model based on historical performance
        """
        # Analyze conversion rates by price points
        price_performance = {}
        
        for data_point in performance_data:
            price_range = self.get_price_range(data_point["final_price"])
            if price_range not in price_performance:
                price_performance[price_range] = {"quotes": 0, "conversions": 0}
            
            price_performance[price_range]["quotes"] += 1
            if data_point["converted"]:
                price_performance[price_range]["conversions"] += 1
        
        # Calculate conversion rates
        optimized_recommendations = {}
        for price_range, performance in price_performance.items():
            conversion_rate = performance["conversions"] / performance["quotes"] if performance["quotes"] > 0 else 0
            optimized_recommendations[price_range] = {
                "conversion_rate": conversion_rate,
                "total_quotes": performance["quotes"],
                "recommendation": "increase_price" if conversion_rate > 0.3 else "decrease_price" if conversion_rate < 0.1 else "maintain_price"
            }
        
        return {
            "model_analyzed": model_name,
            "analysis_date": datetime.now().isoformat(),
            "price_performance": optimized_recommendations,
            "overall_recommendations": self.generate_optimization_recommendations(optimized_recommendations)
        }
    
    def get_price_range(self, price: float) -> str:
        """Categorize price into ranges"""
        if price < 5000:
            return "under_5k"
        elif price < 15000:
            return "5k_to_15k"
        elif price < 50000:
            return "15k_to_50k"
        else:
            return "over_50k"
    
    def generate_optimization_recommendations(self, price_performance: Dict) -> List[str]:
        """Generate actionable recommendations for pricing optimization"""
        recommendations = []
        
        # Find best performing price range
        best_range = max(price_performance.items(), key=lambda x: x[1]["conversion_rate"])
        recommendations.append(f"Best conversion rate in {best_range[0]} range: {best_range[1]['conversion_rate']:.2%}")
        
        # Identify underperforming ranges
        for price_range, performance in price_performance.items():
            if performance["conversion_rate"] < 0.1 and performance["total_quotes"] > 5:
                recommendations.append(f"Consider reducing prices in {price_range} range (conversion rate: {performance['conversion_rate']:.2%})")
        
        # Identify opportunity ranges
        for price_range, performance in price_performance.items():
            if performance["conversion_rate"] > 0.4:
                recommendations.append(f"Consider increasing prices in {price_range} range (high conversion rate: {performance['conversion_rate']:.2%})")
        
        return recommendations
    
    def generate_pricing_report(self, start_date: str, end_date: str) -> Dict:
        """Generate comprehensive pricing analytics report"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get quote statistics
        cursor.execute('''
            SELECT 
                COUNT(*) as total_quotes,
                AVG(calculated_price) as avg_price,
                AVG(discount_percentage) as avg_discount,
                COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_quotes
            FROM price_quotes
            WHERE created_date BETWEEN ? AND ?
        ''', (start_date, end_date))
        
        quote_stats = cursor.fetchone()
        
        # Get pricing by client segment
        cursor.execute('''
            SELECT 
                cp.segment,
                COUNT(pq.id) as quote_count,
                AVG(pq.calculated_price) as avg_price,
                COUNT(CASE WHEN pq.status = 'accepted' THEN 1 END) as conversions
            FROM price_quotes pq
            JOIN client_profiles cp ON pq.client_id = cp.id
            WHERE pq.created_date BETWEEN ? AND ?
            GROUP BY cp.segment
        ''', (start_date, end_date))
        
        segment_analysis = cursor.fetchall()
        
        conn.close()
        
        return {
            "report_period": f"{start_date} to {end_date}",
            "overall_metrics": {
                "total_quotes": quote_stats[0],
                "average_price": round(quote_stats[1], 2) if quote_stats[1] else 0,
                "average_discount": round(quote_stats[2], 2) if quote_stats[2] else 0,
                "conversion_rate": round((quote_stats[3] / quote_stats[0]) * 100, 2) if quote_stats[0] > 0 else 0
            },
            "segment_analysis": [
                {
                    "segment": segment[0],
                    "quote_count": segment[1],
                    "avg_price": round(segment[2], 2),
                    "conversion_rate": round((segment[3] / segment[1]) * 100, 2) if segment[1] > 0 else 0
                }
                for segment in segment_analysis
            ]
        }

    def generate_features_comparison_display(self) -> str:
        """
        Generate formatted display of features comparison for marketing materials
        """
        comparison = self.features_comparison
        
        display = f"""
# {comparison['section_title']}
## {comparison['subtitle']}

## 🔍 BEFORE vs AFTER COMPARISON

### ❌ {comparison['before_after_comparison']['manual_support']['title']}
"""
        
        for item in comparison['before_after_comparison']['manual_support']['disadvantages']:
            display += f"{item['icon']} **{item['text']}**\n   Impact: {item['impact']}\n\n"
        
        display += f"""
### ✅ {comparison['before_after_comparison']['ai_powered_support']['title']}
"""
        
        for item in comparison['before_after_comparison']['ai_powered_support']['advantages']:
            display += f"{item['icon']} **{item['text']}**\n   Impact: {item['impact']}\n\n"
        
        display += "\n## 🚀 KEY FEATURES GRID\n\n"
        
        for feature in comparison['key_features_grid']['features']:
            display += f"### {feature['icon']} {feature['title']}\n"
            display += f"**{feature['description']}**\n\n"
            display += "**Key Benefits:**\n"
            for benefit in feature['key_benefits']:
                display += f"• {benefit}\n"
            display += f"**ROI Metric:** {feature['roi_metric']}\n\n"
        
        display += "\n## 📊 COMPETITIVE ADVANTAGES\n\n"
        
        for category in comparison['competitive_advantages']['advantages']:
            display += f"### {category['category']}\n"
            for metric in category['metrics']:
                display += f"**{metric['metric']}:** {metric['us']} vs {metric['competitors']} ({metric['improvement']})\n"
            display += "\n"
        
        display += "\n## 💬 CUSTOMER SUCCESS STORIES\n\n"
        
        for testimonial in comparison['social_proof']['testimonials']:
            display += f"### {testimonial['company']} - {testimonial['industry']}\n"
            display += f"*\"{testimonial['quote']}\"*\n"
            display += f"— **{testimonial['author']}**, {testimonial['title']}\n\n"
            display += "**Results:**\n"
            for key, value in testimonial['results'].items():
                display += f"• {key.replace('_', ' ').title()}: {value}\n"
            display += "\n"
        
        display += f"\n## 💰 ROI CALCULATOR\n\n"
        display += f"**{comparison['roi_calculator']['description']}**\n\n"
        display += "**Sample Results:**\n"
        for key, value in comparison['roi_calculator']['sample_results'].items():
            display += f"• {key.replace('_', ' ').title()}: {value}\n"
        
        display += f"\n## 🗺️ IMPLEMENTATION ROADMAP\n\n"
        for phase in comparison['implementation_roadmap']['phases']:
            display += f"### {phase['phase']}\n"
            display += "**Activities:**\n"
            for activity in phase['activities']:
                display += f"• {activity}\n"
            display += "**Deliverables:** " + ", ".join(phase['deliverables']) + "\n\n"
        
        display += f"\n---\n\n**{comparison['bottom_text']}**\n\n"
        display += f"🔥 **{comparison['call_to_action']['primary']['text']}**\n"
        display += f"⚡ {comparison['call_to_action']['primary']['urgency']}\n\n"
        display += f"📊 **{comparison['call_to_action']['secondary']['text']}**\n"
        display += f"{comparison['call_to_action']['secondary']['description']}\n"
        
        return display
    
    def calculate_roi_for_prospect(self, current_monthly_cost: float, tickets_per_month: int, 
                                 current_response_time_hours: float, satisfaction_score: int) -> Dict:
        """
        Calculate ROI for a specific prospect using their current metrics
        """
        # AI system cost calculation
        base_ai_cost = 2500
        per_ticket_cost = 0.50
        ai_monthly_cost = base_ai_cost + (tickets_per_month * per_ticket_cost)
        
        # Savings calculation
        monthly_savings = current_monthly_cost - ai_monthly_cost
        annual_savings = monthly_savings * 12
        
        # ROI calculation
        annual_ai_cost = ai_monthly_cost * 12
        roi_percentage = (annual_savings / annual_ai_cost) * 100 if annual_ai_cost > 0 else 0
        
        # Payback period
        payback_period_months = annual_ai_cost / monthly_savings if monthly_savings > 0 else 999
        
        # Performance improvements
        response_time_improvement = (current_response_time_hours * 3600) / 30  # From hours to 30 seconds
        satisfaction_improvement = min(10, satisfaction_score + 2) - satisfaction_score
        
        return {
            "current_metrics": {
                "monthly_cost": f"${current_monthly_cost:,.2f}",
                "annual_cost": f"${current_monthly_cost * 12:,.2f}",
                "response_time": f"{current_response_time_hours} hours",
                "satisfaction_score": f"{satisfaction_score}/10"
            },
            "ai_metrics": {
                "monthly_cost": f"${ai_monthly_cost:,.2f}",
                "annual_cost": f"${annual_ai_cost:,.2f}",
                "response_time": "30 seconds",
                "satisfaction_score": f"{min(10, satisfaction_score + 2)}/10"
            },
            "savings": {
                "monthly_savings": f"${monthly_savings:,.2f}",
                "annual_savings": f"${annual_savings:,.2f}",
                "roi_percentage": f"{roi_percentage:.1f}%",
                "payback_period_months": f"{payback_period_months:.1f}"
            },
            "improvements": {
                "response_time_improvement": f"{response_time_improvement:.0f}x faster",
                "cost_reduction": f"{(monthly_savings/current_monthly_cost)*100:.1f}%",
                "satisfaction_improvement": f"+{satisfaction_improvement} points"
            }
        }
    
    def generate_final_cta_section(self) -> Dict[str, Any]:
        """
        Generate final CTA section with conversion elements and professional footer
        """
        return {
            "final_cta": {
                "background": "gradient_orange",
                "title": "Ready to Cut Support Costs by 60%?",
                "subtitle": "Join 500+ businesses saving $8,000+ monthly with AI automation",
                "primary_button": {
                    "text": "Calculate My Savings",
                    "style": "white_button",
                    "action": "open_roi_calculator"
                },
                "secondary_button": {
                    "text": "Watch 2-Minute Demo", 
                    "style": "transparent_border",
                    "action": "play_demo_video"
                },
                "trust_elements": [
                    {"icon": "⭐", "text": "Setup in 24 hours guaranteed"},
                    {"icon": "⭐", "text": "30-day money-back guarantee"},
                    {"icon": "⭐", "text": "SOC 2 certified & secure"}
                ]
            },
            
            "footer": {
                "background_color": "#1A202C",
                "text_color": "white",
                "accent_color": "orange",
                
                "company_info": {
                    "logo": "company_logo.svg",
                    "tagline": "Transform customer service with AI automation",
                    "contact": {
                        "phone": "+1 (555) 123-4567",
                        "email": "hello@yourcompany.com"
                    }
                },
                
                "links_sections": [
                    {
                        "title": "Quick Links",
                        "links": [
                            {"text": "How It Works", "url": "/how-it-works"},
                            {"text": "Pricing", "url": "/pricing"},
                            {"text": "Case Studies", "url": "/case-studies"},
                            {"text": "Integrations", "url": "/integrations"},
                            {"text": "Contact", "url": "/contact"}
                        ]
                    },
                    {
                        "title": "Resources",
                        "links": [
                            {"text": "Blog", "url": "/blog"},
                            {"text": "Documentation", "url": "/docs"},
                            {"text": "API Reference", "url": "/api"},
                            {"text": "Help Center", "url": "/help"}
                        ]
                    },
                    {
                        "title": "Legal",
                        "links": [
                            {"text": "Privacy Policy", "url": "/privacy"},
                            {"text": "Terms of Service", "url": "/terms"},
                            {"text": "Security", "url": "/security"},
                            {"text": "Status Page", "url": "/status"}
                        ]
                    }
                ],
                
                "copyright": "© 2025 Your Company Name. All rights reserved."
            }
        }

def main():
    """
    Example usage of dynamic pricing engine with features comparison
    """
    pricing_engine = DynamicPricingEngine()
    
    # Create sample client profiles
    clients = [
        ("TechCorp Solutions", "Technology", 250, 50000000, "Series C", 8, 6, 9, 8, 7, "San Francisco, CA"),
        ("StartupInc", "SaaS", 25, 2000000, "Seed", 9, 8, 6, 6, 4, "Austin, TX"),
        ("MegaCorp Enterprises", "Manufacturing", 15000, 5000000000, "Public", 5, 4, 10, 9, 8, "New York, NY")
    ]
    
    client_ids = []
    for company, industry, size, revenue, funding, urgency, competition, strategic, payment, relationship, location in clients:
        client_id = pricing_engine.create_client_profile(
            company, industry, size, revenue, funding, urgency, 
            competition, strategic, payment, relationship, location
        )
        client_ids.append(client_id)
        print(f"Created client profile: {company} (ID: {client_id})")
    
    # Generate dynamic quotes
    for i, client_id in enumerate(client_ids):
        quote = pricing_engine.calculate_dynamic_price(
            client_id, 
            "Revenue Automation Implementation", 
            "value_based",
            {"rush_delivery": i == 1, "white_glove_service": i == 2}  # Different premium factors
        )
        
        client_name = clients[i][0]
        print(f"\nQuote for {client_name}:")
        print(f"  Base Price: ${quote.base_price:,.2f}")
        print(f"  Final Price: ${quote.calculated_price:,.2f}")
        print(f"  Discount: {quote.discount_percentage:.1f}%")
        print(f"  Applied Factors: {quote.pricing_factors_applied}")
    
    # Generate pricing report
    report = pricing_engine.generate_pricing_report("2024-01-01", "2024-12-31")
    print(f"\nPricing Report: {json.dumps(report, indent=2)}")
    
    # Test features comparison display
    print("\n" + "="*50)
    print("FEATURES COMPARISON DISPLAY")
    print("="*50)
    features_display = pricing_engine.generate_features_comparison_display()
    print(features_display[:500] + "...")  # Show first 500 chars
    
    # Test ROI calculation for prospects
    print("\n" + "="*50)
    print("ROI CALCULATOR TEST")
    print("="*50)
    roi_result = pricing_engine.calculate_roi_for_prospect(
        current_monthly_cost=12000,
        tickets_per_month=1500,
        current_response_time_hours=4.5,
        satisfaction_score=7
    )
    print(f"ROI Calculation Results:")
    print(f"Monthly Savings: {roi_result['savings']['monthly_savings']}")
    print(f"Annual Savings: {roi_result['savings']['annual_savings']}")
    print(f"ROI: {roi_result['savings']['roi_percentage']}")
    print(f"Response Time Improvement: {roi_result['improvements']['response_time_improvement']}")
    
    # Test final CTA section
    print("\n" + "="*50)
    print("FINAL CTA & FOOTER SECTION")
    print("="*50)
    cta_section = pricing_engine.generate_final_cta_section()
    print(f"Final CTA Title: {cta_section['final_cta']['title']}")
    print(f"Primary CTA: {cta_section['final_cta']['primary_button']['text']}")
    print(f"Trust Elements: {len(cta_section['final_cta']['trust_elements'])} elements")
    print(f"Footer Sections: {len(cta_section['footer']['links_sections'])} link sections")

if __name__ == "__main__":
    main()