#!/usr/bin/env python3
"""
Partner Referral Program Management System
Comprehensive system for managing partner relationships and referral commissions
"""

import json
import sqlite3
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Any
from decimal import Decimal
import uuid
from enum import Enum

class PartnerTier(Enum):
    BRONZE = "bronze"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"

class ReferralStatus(Enum):
    PENDING = "pending"
    QUALIFIED = "qualified"
    CONVERTED = "converted"
    PAID = "paid"
    DECLINED = "declined"

@dataclass
class Partner:
    id: str
    company_name: str
    contact_name: str
    email: str
    phone: str
    website: str
    industry: str
    tier: PartnerTier
    commission_rate: float
    join_date: str
    status: str  # active, inactive, suspended
    total_referrals: int
    total_revenue_generated: float
    total_commissions_earned: float
    total_commissions_paid: float

@dataclass
class Referral:
    id: str
    partner_id: str
    prospect_email: str
    prospect_name: str
    prospect_company: str
    referral_date: str
    status: ReferralStatus
    deal_value: float
    commission_rate: float
    commission_amount: float
    conversion_date: Optional[str]
    payment_date: Optional[str]
    notes: str

@dataclass
class CommissionPayout:
    id: str
    partner_id: str
    referral_ids: List[str]
    payout_amount: float
    payout_date: str
    payment_method: str
    payment_reference: str
    status: str  # pending, paid, failed

class PartnerReferralManager:
    def __init__(self, db_path="partner_referral.db"):
        self.db_path = db_path
        self.init_database()
        self.tier_requirements = self.get_tier_requirements()
        self.commission_structure = self.get_commission_structure()
    
    def init_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS partners (
                id TEXT PRIMARY KEY,
                company_name TEXT,
                contact_name TEXT,
                email TEXT UNIQUE,
                phone TEXT,
                website TEXT,
                industry TEXT,
                tier TEXT,
                commission_rate REAL,
                join_date TEXT,
                status TEXT,
                total_referrals INTEGER DEFAULT 0,
                total_revenue_generated REAL DEFAULT 0,
                total_commissions_earned REAL DEFAULT 0,
                total_commissions_paid REAL DEFAULT 0,
                created_date TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS referrals (
                id TEXT PRIMARY KEY,
                partner_id TEXT,
                prospect_email TEXT,
                prospect_name TEXT,
                prospect_company TEXT,
                referral_date TEXT,
                status TEXT,
                deal_value REAL DEFAULT 0,
                commission_rate REAL,
                commission_amount REAL DEFAULT 0,
                conversion_date TEXT,
                payment_date TEXT,
                notes TEXT,
                FOREIGN KEY (partner_id) REFERENCES partners (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS commission_payouts (
                id TEXT PRIMARY KEY,
                partner_id TEXT,
                referral_ids TEXT,
                payout_amount REAL,
                payout_date TEXT,
                payment_method TEXT,
                payment_reference TEXT,
                status TEXT,
                FOREIGN KEY (partner_id) REFERENCES partners (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS partner_activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                partner_id TEXT,
                activity_type TEXT,
                activity_description TEXT,
                activity_date TEXT,
                FOREIGN KEY (partner_id) REFERENCES partners (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def get_tier_requirements(self) -> Dict[PartnerTier, Dict]:
        """
        Define requirements for each partner tier
        """
        return {
            PartnerTier.BRONZE: {
                "min_referrals": 0,
                "min_revenue": 0,
                "commission_rate": 0.10,
                "benefits": [
                    "10% commission on all referrals",
                    "Partner portal access",
                    "Marketing materials",
                    "Monthly partner newsletter"
                ]
            },
            PartnerTier.SILVER: {
                "min_referrals": 5,
                "min_revenue": 25000,
                "commission_rate": 0.15,
                "benefits": [
                    "15% commission on all referrals",
                    "Dedicated partner manager",
                    "Co-marketing opportunities",
                    "Quarterly business reviews",
                    "Priority support"
                ]
            },
            PartnerTier.GOLD: {
                "min_referrals": 15,
                "min_revenue": 100000,
                "commission_rate": 0.20,
                "benefits": [
                    "20% commission on all referrals",
                    "Joint sales calls",
                    "Custom marketing collateral",
                    "Partner advisory board access",
                    "Revenue share opportunities"
                ]
            },
            PartnerTier.PLATINUM: {
                "min_referrals": 50,
                "min_revenue": 500000,
                "commission_rate": 0.25,
                "benefits": [
                    "25% commission on all referrals",
                    "Strategic partnership status",
                    "Joint product development",
                    "Executive sponsor relationship",
                    "Exclusive territory rights"
                ]
            }
        }
    
    def get_commission_structure(self) -> Dict:
        """
        Define commission structure for different deal values
        """
        return {
            "base_rates": {
                PartnerTier.BRONZE: 0.10,
                PartnerTier.SILVER: 0.15,
                PartnerTier.GOLD: 0.20,
                PartnerTier.PLATINUM: 0.25
            },
            "deal_value_multipliers": {
                "under_10k": 1.0,
                "10k_to_50k": 1.1,
                "50k_to_100k": 1.2,
                "over_100k": 1.3
            },
            "bonus_structures": {
                "first_referral_bonus": 500,
                "quarterly_volume_bonus": {
                    "threshold": 50000,
                    "bonus_rate": 0.02
                }
            }
        }
    
    def create_partner(self, company_name: str, contact_name: str, email: str,
                      phone: str, website: str, industry: str) -> str:
        """
        Create a new partner account
        """
        partner_id = str(uuid.uuid4())
        
        partner = Partner(
            id=partner_id,
            company_name=company_name,
            contact_name=contact_name,
            email=email,
            phone=phone,
            website=website,
            industry=industry,
            tier=PartnerTier.BRONZE,
            commission_rate=self.tier_requirements[PartnerTier.BRONZE]["commission_rate"],
            join_date=datetime.now().isoformat(),
            status="active",
            total_referrals=0,
            total_revenue_generated=0.0,
            total_commissions_earned=0.0,
            total_commissions_paid=0.0
        )
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO partners
                (id, company_name, contact_name, email, phone, website, industry,
                 tier, commission_rate, join_date, status, total_referrals,
                 total_revenue_generated, total_commissions_earned, 
                 total_commissions_paid, created_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                partner.id, partner.company_name, partner.contact_name, partner.email,
                partner.phone, partner.website, partner.industry, partner.tier.value,
                partner.commission_rate, partner.join_date, partner.status,
                partner.total_referrals, partner.total_revenue_generated,
                partner.total_commissions_earned, partner.total_commissions_paid,
                datetime.now().isoformat()
            ))
            
            conn.commit()
            
            # Log activity
            self.log_partner_activity(partner_id, "partner_created", 
                                    f"New partner account created for {company_name}")
            
            return partner_id
            
        except sqlite3.IntegrityError:
            return None
        finally:
            conn.close()
    
    def create_referral(self, partner_id: str, prospect_email: str, prospect_name: str,
                       prospect_company: str, notes: str = "") -> str:
        """
        Create a new referral
        """
        # Get partner info
        partner = self.get_partner_by_id(partner_id)
        if not partner:
            return None
        
        referral_id = str(uuid.uuid4())
        
        referral = Referral(
            id=referral_id,
            partner_id=partner_id,
            prospect_email=prospect_email,
            prospect_name=prospect_name,
            prospect_company=prospect_company,
            referral_date=datetime.now().isoformat(),
            status=ReferralStatus.PENDING,
            deal_value=0.0,
            commission_rate=partner.commission_rate,
            commission_amount=0.0,
            conversion_date=None,
            payment_date=None,
            notes=notes
        )
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO referrals
            (id, partner_id, prospect_email, prospect_name, prospect_company,
             referral_date, status, deal_value, commission_rate, commission_amount,
             conversion_date, payment_date, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            referral.id, referral.partner_id, referral.prospect_email,
            referral.prospect_name, referral.prospect_company, referral.referral_date,
            referral.status.value, referral.deal_value, referral.commission_rate,
            referral.commission_amount, referral.conversion_date,
            referral.payment_date, referral.notes
        ))
        
        # Update partner referral count
        cursor.execute('''
            UPDATE partners 
            SET total_referrals = total_referrals + 1
            WHERE id = ?
        ''', (partner_id,))
        
        conn.commit()
        conn.close()
        
        # Log activity
        self.log_partner_activity(partner_id, "referral_created",
                                f"New referral created for {prospect_name} at {prospect_company}")
        
        # Check for first referral bonus
        if partner.total_referrals == 0:
            self.apply_first_referral_bonus(partner_id)
        
        return referral_id
    
    def convert_referral(self, referral_id: str, deal_value: float) -> bool:
        """
        Convert a referral to a paying customer
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get referral details
        cursor.execute('SELECT * FROM referrals WHERE id = ?', (referral_id,))
        referral_data = cursor.fetchone()
        
        if not referral_data:
            conn.close()
            return False
        
        partner_id = referral_data[1]
        commission_rate = referral_data[8]
        
        # Calculate commission with multipliers
        commission_amount = self.calculate_commission(deal_value, commission_rate)
        
        # Update referral
        cursor.execute('''
            UPDATE referrals
            SET status = ?, deal_value = ?, commission_amount = ?, conversion_date = ?
            WHERE id = ?
        ''', (ReferralStatus.CONVERTED.value, deal_value, commission_amount,
              datetime.now().isoformat(), referral_id))
        
        # Update partner totals
        cursor.execute('''
            UPDATE partners
            SET total_revenue_generated = total_revenue_generated + ?,
                total_commissions_earned = total_commissions_earned + ?
            WHERE id = ?
        ''', (deal_value, commission_amount, partner_id))
        
        conn.commit()
        conn.close()
        
        # Log activity
        self.log_partner_activity(partner_id, "referral_converted",
                                f"Referral converted: ${deal_value:,.2f} deal, ${commission_amount:,.2f} commission")
        
        # Check if partner qualifies for tier upgrade
        self.check_tier_upgrade(partner_id)
        
        return True
    
    def calculate_commission(self, deal_value: float, base_rate: float) -> float:
        """
        Calculate commission with multipliers based on deal value
        """
        multiplier = 1.0
        
        if deal_value >= 100000:
            multiplier = self.commission_structure["deal_value_multipliers"]["over_100k"]
        elif deal_value >= 50000:
            multiplier = self.commission_structure["deal_value_multipliers"]["50k_to_100k"]
        elif deal_value >= 10000:
            multiplier = self.commission_structure["deal_value_multipliers"]["10k_to_50k"]
        else:
            multiplier = self.commission_structure["deal_value_multipliers"]["under_10k"]
        
        return deal_value * base_rate * multiplier
    
    def apply_first_referral_bonus(self, partner_id: str):
        """
        Apply first referral bonus to partner
        """
        bonus_amount = self.commission_structure["bonus_structures"]["first_referral_bonus"]
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE partners
            SET total_commissions_earned = total_commissions_earned + ?
            WHERE id = ?
        ''', (bonus_amount, partner_id))
        
        conn.commit()
        conn.close()
        
        self.log_partner_activity(partner_id, "bonus_applied",
                                f"First referral bonus applied: ${bonus_amount}")
    
    def check_tier_upgrade(self, partner_id: str):
        """
        Check if partner qualifies for tier upgrade
        """
        partner = self.get_partner_by_id(partner_id)
        if not partner:
            return
        
        current_tier = PartnerTier(partner.tier.value if hasattr(partner.tier, 'value') else partner.tier)
        new_tier = current_tier
        
        # Check tier requirements in descending order
        for tier in [PartnerTier.PLATINUM, PartnerTier.GOLD, PartnerTier.SILVER, PartnerTier.BRONZE]:
            requirements = self.tier_requirements[tier]
            if (partner.total_referrals >= requirements["min_referrals"] and
                partner.total_revenue_generated >= requirements["min_revenue"]):
                new_tier = tier
                break
        
        if new_tier != current_tier:
            self.upgrade_partner_tier(partner_id, new_tier)
    
    def upgrade_partner_tier(self, partner_id: str, new_tier: PartnerTier):
        """
        Upgrade partner to new tier
        """
        new_commission_rate = self.tier_requirements[new_tier]["commission_rate"]
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE partners
            SET tier = ?, commission_rate = ?
            WHERE id = ?
        ''', (new_tier.value, new_commission_rate, partner_id))
        
        conn.commit()
        conn.close()
        
        self.log_partner_activity(partner_id, "tier_upgraded",
                                f"Partner upgraded to {new_tier.value.title()} tier")
    
    def create_commission_payout(self, partner_id: str, payment_method: str = "bank_transfer") -> str:
        """
        Create commission payout for partner's unpaid referrals
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get unpaid referrals
        cursor.execute('''
            SELECT id, commission_amount FROM referrals
            WHERE partner_id = ? AND status = 'converted' AND payment_date IS NULL
        ''', (partner_id,))
        
        unpaid_referrals = cursor.fetchall()
        
        if not unpaid_referrals:
            conn.close()
            return None
        
        payout_id = str(uuid.uuid4())
        referral_ids = [ref[0] for ref in unpaid_referrals]
        total_amount = sum(ref[1] for ref in unpaid_referrals)
        
        # Create payout record
        cursor.execute('''
            INSERT INTO commission_payouts
            (id, partner_id, referral_ids, payout_amount, payout_date,
             payment_method, payment_reference, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            payout_id, partner_id, json.dumps(referral_ids), total_amount,
            datetime.now().isoformat(), payment_method, f"PAY-{payout_id[:8]}", "pending"
        ))
        
        # Mark referrals as paid
        for referral_id in referral_ids:
            cursor.execute('''
                UPDATE referrals
                SET status = 'paid', payment_date = ?
                WHERE id = ?
            ''', (datetime.now().isoformat(), referral_id))
        
        # Update partner paid commissions
        cursor.execute('''
            UPDATE partners
            SET total_commissions_paid = total_commissions_paid + ?
            WHERE id = ?
        ''', (total_amount, partner_id))
        
        conn.commit()
        conn.close()
        
        self.log_partner_activity(partner_id, "payout_created",
                                f"Commission payout created: ${total_amount:,.2f}")
        
        return payout_id
    
    def get_partner_by_id(self, partner_id: str) -> Optional[Partner]:
        """
        Get partner details by ID
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM partners WHERE id = ?', (partner_id,))
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return Partner(
                id=result[0],
                company_name=result[1],
                contact_name=result[2],
                email=result[3],
                phone=result[4],
                website=result[5],
                industry=result[6],
                tier=PartnerTier(result[7]),
                commission_rate=result[8],
                join_date=result[9],
                status=result[10],
                total_referrals=result[11],
                total_revenue_generated=result[12],
                total_commissions_earned=result[13],
                total_commissions_paid=result[14]
            )
        
        return None
    
    def get_partner_dashboard(self, partner_id: str) -> Dict:
        """
        Get comprehensive dashboard data for partner
        """
        partner = self.get_partner_by_id(partner_id)
        if not partner:
            return {}
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get referral statistics
        cursor.execute('''
            SELECT 
                COUNT(*) as total_referrals,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_referrals,
                COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified_referrals,
                COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_referrals,
                COALESCE(SUM(CASE WHEN status = 'converted' THEN deal_value END), 0) as total_revenue,
                COALESCE(SUM(CASE WHEN status = 'converted' THEN commission_amount END), 0) as total_commissions
            FROM referrals
            WHERE partner_id = ?
        ''', (partner_id,))
        
        referral_stats = cursor.fetchone()
        
        # Get recent referrals
        cursor.execute('''
            SELECT prospect_name, prospect_company, referral_date, status, deal_value, commission_amount
            FROM referrals
            WHERE partner_id = ?
            ORDER BY referral_date DESC
            LIMIT 10
        ''', (partner_id,))
        
        recent_referrals = cursor.fetchall()
        
        # Get unpaid commissions
        cursor.execute('''
            SELECT COALESCE(SUM(commission_amount), 0)
            FROM referrals
            WHERE partner_id = ? AND status = 'converted' AND payment_date IS NULL
        ''', (partner_id,))
        
        unpaid_commissions = cursor.fetchone()[0]
        
        conn.close()
        
        # Calculate next tier requirements
        current_tier = partner.tier
        next_tier_info = self.get_next_tier_requirements(partner)
        
        return {
            'partner_info': {
                'company_name': partner.company_name,
                'contact_name': partner.contact_name,
                'tier': partner.tier.value.title(),
                'commission_rate': f"{partner.commission_rate * 100:.0f}%",
                'join_date': partner.join_date,
                'status': partner.status
            },
            'performance_metrics': {
                'total_referrals': referral_stats[0],
                'pending_referrals': referral_stats[1],
                'qualified_referrals': referral_stats[2],
                'converted_referrals': referral_stats[3],
                'conversion_rate': round((referral_stats[3] / referral_stats[0]) * 100, 2) if referral_stats[0] > 0 else 0,
                'total_revenue_generated': referral_stats[4],
                'total_commissions_earned': referral_stats[5],
                'unpaid_commissions': unpaid_commissions
            },
            'next_tier_requirements': next_tier_info,
            'recent_referrals': [
                {
                    'prospect_name': ref[0],
                    'prospect_company': ref[1],
                    'referral_date': ref[2],
                    'status': ref[3],
                    'deal_value': ref[4],
                    'commission_amount': ref[5]
                }
                for ref in recent_referrals
            ]
        }
    
    def get_next_tier_requirements(self, partner: Partner) -> Dict:
        """
        Get requirements for next tier upgrade
        """
        tiers = [PartnerTier.BRONZE, PartnerTier.SILVER, PartnerTier.GOLD, PartnerTier.PLATINUM]
        current_tier_index = tiers.index(partner.tier)
        
        if current_tier_index >= len(tiers) - 1:
            return {'message': 'Already at highest tier'}
        
        next_tier = tiers[current_tier_index + 1]
        requirements = self.tier_requirements[next_tier]
        
        return {
            'next_tier': next_tier.value.title(),
            'current_referrals': partner.total_referrals,
            'required_referrals': requirements["min_referrals"],
            'referrals_needed': max(0, requirements["min_referrals"] - partner.total_referrals),
            'current_revenue': partner.total_revenue_generated,
            'required_revenue': requirements["min_revenue"],
            'revenue_needed': max(0, requirements["min_revenue"] - partner.total_revenue_generated),
            'new_commission_rate': f"{requirements['commission_rate'] * 100:.0f}%",
            'benefits': requirements["benefits"]
        }
    
    def log_partner_activity(self, partner_id: str, activity_type: str, description: str):
        """
        Log partner activity
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO partner_activities
            (partner_id, activity_type, activity_description, activity_date)
            VALUES (?, ?, ?, ?)
        ''', (partner_id, activity_type, description, datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
    
    def generate_partner_report(self, start_date: str, end_date: str) -> Dict:
        """
        Generate comprehensive partner program report
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Overall program metrics
        cursor.execute('''
            SELECT 
                COUNT(*) as total_partners,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_partners,
                COALESCE(SUM(total_referrals), 0) as total_referrals,
                COALESCE(SUM(total_revenue_generated), 0) as total_revenue,
                COALESCE(SUM(total_commissions_earned), 0) as total_commissions_earned,
                COALESCE(SUM(total_commissions_paid), 0) as total_commissions_paid
            FROM partners
        ''')
        
        program_metrics = cursor.fetchone()
        
        # Tier distribution
        cursor.execute('''
            SELECT tier, COUNT(*) 
            FROM partners 
            WHERE status = 'active'
            GROUP BY tier
        ''')
        
        tier_distribution = {tier: count for tier, count in cursor.fetchall()}
        
        # Top performing partners
        cursor.execute('''
            SELECT company_name, contact_name, tier, total_revenue_generated, total_commissions_earned
            FROM partners
            WHERE status = 'active'
            ORDER BY total_revenue_generated DESC
            LIMIT 10
        ''')
        
        top_partners = cursor.fetchall()
        
        # Recent activity
        cursor.execute('''
            SELECT r.referral_date, p.company_name, r.prospect_name, r.prospect_company, r.status, r.deal_value
            FROM referrals r
            JOIN partners p ON r.partner_id = p.id
            WHERE r.referral_date BETWEEN ? AND ?
            ORDER BY r.referral_date DESC
            LIMIT 50
        ''', (start_date, end_date))
        
        recent_activity = cursor.fetchall()
        
        conn.close()
        
        return {
            'report_period': f"{start_date} to {end_date}",
            'program_overview': {
                'total_partners': program_metrics[0],
                'active_partners': program_metrics[1],
                'total_referrals': program_metrics[2],
                'total_revenue_generated': program_metrics[3],
                'total_commissions_earned': program_metrics[4],
                'total_commissions_paid': program_metrics[5],
                'outstanding_commissions': program_metrics[4] - program_metrics[5]
            },
            'tier_distribution': tier_distribution,
            'top_partners': [
                {
                    'company_name': partner[0],
                    'contact_name': partner[1],
                    'tier': partner[2],
                    'revenue_generated': partner[3],
                    'commissions_earned': partner[4]
                }
                for partner in top_partners
            ],
            'recent_activity': [
                {
                    'date': activity[0],
                    'partner_company': activity[1],
                    'prospect_name': activity[2],
                    'prospect_company': activity[3],
                    'status': activity[4],
                    'deal_value': activity[5]
                }
                for activity in recent_activity
            ]
        }

def main():
    """
    Example usage of partner referral program system
    """
    referral_manager = PartnerReferralManager()
    
    # Create sample partners
    partners = [
        ("TechConsult Partners", "John Smith", "john@techconsult.com", "+1-555-0101", "techconsult.com", "Technology"),
        ("GrowthAgency Inc", "Sarah Johnson", "sarah@growthagency.com", "+1-555-0102", "growthagency.com", "Marketing"),
        ("InnovateNow Solutions", "Mike Chen", "mike@innovatenow.com", "+1-555-0103", "innovatenow.com", "Consulting")
    ]
    
    partner_ids = []
    for company, name, email, phone, website, industry in partners:
        partner_id = referral_manager.create_partner(company, name, email, phone, website, industry)
        partner_ids.append(partner_id)
        print(f"Created partner: {company} (ID: {partner_id})")
    
    # Create sample referrals
    referrals = [
        (partner_ids[0], "lead1@prospect.com", "Alex Wilson", "ProspectCorp", "Great fit for automation"),
        (partner_ids[0], "lead2@prospect.com", "Lisa Davis", "GrowthCo", "Interested in sales optimization"),
        (partner_ids[1], "lead3@prospect.com", "Tom Brown", "ScaleTech", "Need revenue automation"),
    ]
    
    referral_ids = []
    for partner_id, email, name, company, notes in referrals:
        referral_id = referral_manager.create_referral(partner_id, email, name, company, notes)
        referral_ids.append(referral_id)
        print(f"Created referral: {name} from {company}")
    
    # Convert some referrals
    referral_manager.convert_referral(referral_ids[0], 25000.00)
    referral_manager.convert_referral(referral_ids[1], 45000.00)
    
    # Create payout for first partner
    payout_id = referral_manager.create_commission_payout(partner_ids[0])
    print(f"Created payout: {payout_id}")
    
    # Get partner dashboard
    dashboard = referral_manager.get_partner_dashboard(partner_ids[0])
    print(f"Partner dashboard: {json.dumps(dashboard, indent=2, default=str)}")
    
    # Generate program report
    report = referral_manager.generate_partner_report("2024-01-01", "2024-12-31")
    print(f"Program report: {json.dumps(report, indent=2, default=str)}")

if __name__ == "__main__":
    main()