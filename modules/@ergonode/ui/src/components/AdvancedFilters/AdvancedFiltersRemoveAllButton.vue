/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <button
        type="button"
        class="advanced-filters-remove-all-button">
        <IconCancel />
        {{ title }}
    </button>
</template>

<script>
import IconCancel from '@UI/components/Icons/Actions/IconCancel';

export default {
    name: 'AdvancedFiltersRemoveAllButton',
    components: {
        IconCancel,
    },
    props: {
        title: {
            type: String,
            default: 'Remove filters',
        },
    },
};
</script>

<style lang="scss" scoped>
    .advanced-filters-remove-all-button {
        display: flex;
        align-items: center;
        border: none;
        padding: 0 8px;
        background-color: $WHITE;
        color: $GRAPHITE_DARK;
        font: $FONT_MEDIUM_12_16;
        cursor: pointer;
        outline: none;
    }
</style>
