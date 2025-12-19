export type FeatureCategory = 'usage' | 'export' | 'design' | 'support' | 'feature'

export type FeatureDefinition = {
  id: string
  category: 'usage' | 'export' | 'design' | 'support' | 'feature'
  label: string
  type: 'number' | 'boolean' | 'string'
  defaultValue: string
  isLimit: boolean
  description?: string
}

export const FEATURE_REGISTRY: FeatureDefinition[] = [
  // Core Features
  { id: 'page_overview_limit', label: 'Page Overview', category: 'usage', defaultValue: '3/month', isLimit: true, type: 'string' },
  { id: 'inspect_mode_limit', label: 'Inspect Mode (Hover for CSS)', category: 'usage', defaultValue: '3/month', isLimit: true, type: 'string' },
  { id: 'color_palette_limit', label: 'Color Palette Viewer', category: 'usage', defaultValue: 'true', isLimit: false, type: 'boolean' },
  { id: 'contrast_check_limit', label: 'Contrast Checks', category: 'usage', defaultValue: '3/month', isLimit: true, type: 'string' },
  { id: 'seo_audit', label: 'Full SEO Audit', category: 'usage', defaultValue: 'true', isLimit: false, type: 'boolean' },
  { id: 'page_health', label: 'Real-time Page Health Score', category: 'usage', defaultValue: 'true', isLimit: false, type: 'boolean' },
  { id: 'image_audit', label: 'Image Optimization & Alt Audit', category: 'usage', defaultValue: 'true', isLimit: false, type: 'boolean' },
  { id: 'link_analysis', label: 'Internal & External Link Analysis', category: 'usage', defaultValue: 'true', isLimit: false, type: 'boolean' },
  { id: 'ai_brand_visibility', label: 'AI Brand Visibility', category: 'usage', defaultValue: 'true', isLimit: false, type: 'boolean' },
  { id: 'structured_data', label: 'Structured Data (Schema)', category: 'usage', defaultValue: 'true', isLimit: false, type: 'boolean' },
  { id: 'social_preview', label: 'Social Media Previews', category: 'usage', defaultValue: 'true', isLimit: false, type: 'boolean' },

  // Design System Tools
  { id: 'design_system_extraction', label: 'Design System Extraction', category: 'design', defaultValue: 'Preview only', isLimit: false, type: 'string' },

  // Export
  { id: 'export_css', label: 'Export to CSS', category: 'export', defaultValue: 'false', isLimit: false, type: 'boolean' },
  { id: 'export_tailwind', label: 'Export to Tailwind Config', category: 'export', defaultValue: 'false', isLimit: false, type: 'boolean' },

  // Assets
  { id: 'asset_extraction_limit', label: 'Asset Extraction (Total)', category: 'feature', defaultValue: '50/month', isLimit: true, type: 'string' },
  { id: 'individual_downloads', label: 'Individual Downloads', category: 'feature', defaultValue: 'true', isLimit: false, type: 'boolean' },
  { id: 'bulk_export', label: 'Bulk Export (All Assets)', category: 'feature', defaultValue: 'false', isLimit: false, type: 'boolean' },
  { id: 'lottie_extraction_limit', label: 'Lottie Animation Extractions', category: 'feature', defaultValue: '50/month', isLimit: true, type: 'string' },

  // Support
  { id: 'support', label: 'Support Level', category: 'support', defaultValue: 'Standard', isLimit: false, type: 'string' }
]

export const getFeatureLabel = (key: string) => FEATURE_REGISTRY.find(f => f.id === key)?.label || key
export const getFeatureCategory = (key: string) => FEATURE_REGISTRY.find(f => f.id === key)?.category || 'Other'
