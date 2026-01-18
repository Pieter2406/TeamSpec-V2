// Re-export all utils
export {
    getArtifactIcon,
    getArtifactsByCategory,
    getCategoryLabel,
    ARTIFACT_ICONS,
    CATEGORY_COLORS,
    type ArtifactType,
    type ArtifactCategory,
    type ArtifactIconConfig,
} from './artifactIcons';
export {
    sortArtifacts,
    filterArtifacts,
    filterAndSortArtifacts,
    groupArtifactsByCategory,
    countByCategory,
    type SortableArtifact,
} from './artifactSorting';
export {
    STATUS_OPTIONS,
    getStatusOptions,
    getStatusValues,
    isValidStatus,
    getStatusColor,
    getValidStatusesString,
    type StatusValue,
    type StatusConfig,
} from './statusOptions';
