export function navigateTo(path: string) {
  window.location.hash = `#/${path}`;
}

export function parseRoute(hash: string) {
  // Remove leading '#/' if present
  const path = hash.replace(/^#\//, '');
  
  // Split path into segments
  const segments = path.split('/');
  
  // Extract view (first segment)
  const view = segments[0] || 'dashboard';
  
  // Parse parameters from remaining segments
  const params: Record<string, string> = {};
  
  // Handle specific route patterns
  if (segments[0] === 'stores' && segments[1] && segments[2] === 'menus') {
    params.storeId = segments[1];
    return { view: 'menus', params };
  }
  
  // Default case
  return { view, params };
}