import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { SettingsConfig, Lead, Alumnus, TelemetryEvent } from '../types';
import { INITIAL_LEADS } from '../data/leadsData';
import { ALUMNI_DATABASE } from '../data/alumniData';

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(settings?: SettingsConfig): SupabaseClient | null {
  const url = settings?.supabaseUrl?.trim() || import.meta.env.VITE_SUPABASE_URL || '';
  const key = settings?.supabaseAnonKey?.trim() || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (!url || !key) return null;

  if (cachedClient && lastUrl === url && lastKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key);
    lastUrl = url;
    lastKey = key;
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ isConnected: boolean; message: string }> {
  const targetUrl = url?.trim() || import.meta.env.VITE_SUPABASE_URL || '';
  const targetKey = anonKey?.trim() || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (!targetUrl || !targetKey) {
    return {
      isConnected: false,
      message: 'Supabase URL or Publishable/Anon Key missing. (App is running in persistent local fallback mode).',
    };
  }

  try {
    const client = createClient(targetUrl, targetKey);
    const { data, error } = await client.from('niat_leads').select('count', { count: 'exact', head: true });
    
    if (error) {
      // If table doesn't exist yet, but credentials are valid
      if (error.code === '42P01') {
        return {
          isConnected: true,
          message: 'Connected to Supabase! Please run supabase_setup.sql in SQL Editor to create tables.',
        };
      }
      return {
        isConnected: false,
        message: `Supabase Error: ${error.message}`,
      };
    }

    return {
      isConnected: true,
      message: 'Successfully connected to live Supabase database with niat_leads table!',
    };
  } catch (err: any) {
    return {
      isConnected: false,
      message: `Connection failed: ${err.message || 'Check URL and CORS configuration'}`,
    };
  }
}

export async function fetchLeadsFromSupabase(settings?: SettingsConfig): Promise<Lead[]> {
  const client = getSupabaseClient(settings);
  if (!client) return INITIAL_LEADS;

  try {
    const { data, error } = await client.from('niat_leads').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return INITIAL_LEADS;
    }

    return data.map((row: any) => ({
      id: row.id,
      studentName: row.student_name,
      parentName: row.parent_name,
      parentRelation: row.parent_relation || 'Father',
      district: row.district,
      state: row.state,
      targetCollege: row.target_college,
      language: row.language,
      objection: row.objection,
      objectionDetail: row.objection_detail,
      natScore: row.nat_score || 80,
      natPercentile: row.nat_percentile || 88,
      daysStagnant: row.days_stagnant || 7,
      phone: row.phone || '+91 98480 32114',
      status: row.status || 'pending',
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.warn('Error fetching leads from Supabase, using initial data:', err);
    return INITIAL_LEADS;
  }
}

export async function fetchAlumniFromSupabase(settings?: SettingsConfig): Promise<Alumnus[]> {
  const client = getSupabaseClient(settings);
  if (!client) return ALUMNI_DATABASE;

  try {
    const { data, error } = await client.from('niat_alumni').select('*');
    if (error || !data || data.length === 0) {
      return ALUMNI_DATABASE;
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      hometown: row.hometown,
      district: row.district,
      state: row.state,
      language: row.language,
      college: row.college,
      gradYear: row.grad_year,
      startingCtc: row.starting_ctc,
      currentCompany: row.current_company,
      role: row.role,
      initialCodingSkill: row.initial_coding_skill,
      familyBackground: row.family_background,
      offerLetterRef: row.offer_letter_ref,
      avatarUrl: row.avatar_url,
      relatableStory: row.relatable_story,
      addressedObjections: row.addressed_objections || [],
    }));
  } catch (err) {
    return ALUMNI_DATABASE;
  }
}

export async function syncLeadToSupabase(lead: Lead, settings?: SettingsConfig): Promise<boolean> {
  const client = getSupabaseClient(settings);
  if (!client) return false;

  try {
    const { error } = await client.from('niat_leads').upsert({
      id: lead.id,
      student_name: lead.studentName,
      parent_name: lead.parentName,
      parent_relation: lead.parentRelation,
      district: lead.district,
      state: lead.state,
      target_college: lead.targetCollege,
      language: lead.language,
      objection: lead.objection,
      objection_detail: lead.objectionDetail,
      nat_score: lead.natScore,
      nat_percentile: lead.natPercentile,
      days_stagnant: lead.daysStagnant,
      phone: lead.phone,
      status: lead.status,
    });
    return !error;
  } catch (e) {
    return false;
  }
}

export async function syncTelemetryToSupabase(event: TelemetryEvent, settings?: SettingsConfig): Promise<boolean> {
  const client = getSupabaseClient(settings);
  if (!client) return false;

  try {
    const { error } = await client.from('niat_telemetry').insert({
      id: event.id,
      lead_id: event.leadId,
      event_type: event.eventType,
      score_contribution: event.scoreContribution,
      metadata: event.metadata || {},
    });
    return !error;
  } catch (e) {
    return false;
  }
}
