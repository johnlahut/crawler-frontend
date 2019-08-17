export let Globals = {
  lookForFilters: ['partners', 'resources', 'organizations', 'collaborators'],
  contentTypeFilters: ['links', 'pdfs', 'images', 'headers'],
  excludeFilters: ['facebook', 'instagram', 'linkedin', 'twitter', 'google'],

  lookForFilterDefaults: ['partners', 'resources', 'organizations'],
  contentTypeFilterDefaults: ['links', 'headers'],
  excludeFilterDefaults: ['facebook', 'instagram', 'linkedin', 'twitter'],

  LOOK_FOR_FILTER: 'look_for',
  CONTENT_FILTER: 'content_type',
  EXCLUDE_FILTER: 'exclude',

  NOT_STARTED_STATUS: 'not_started',
  IN_PROGRESS_STATUS: 'in_progress',
  ERROR_STATUS: 'error',
  WARNING_STATUS: 'warning',
  COMPLETE_STATUS: 'completed',

  lookForButtonClass: 'look-for-button',
  contentTypeButtonClass: 'content-type-button',
  excludeButtonClass: 'exclude-button',

  DEV_API: `http://localhost:8000`,

};
