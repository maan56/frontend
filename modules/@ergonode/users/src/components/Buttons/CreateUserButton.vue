/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Button
        :title="$t('user.page.addButton')"
        :size="smallSize"
        :disabled="!isAllowedToCreate"
        @click.native="onShowModal">
        <template #prepend="{ color }">
            <IconAdd :fill-color="color" />
        </template>
        <CreateUserModalForm
            v-if="isModalVisible"
            @close="onCloseModal"
            @created="onCreatedData" />
    </Button>
</template>

<script>
import {
    SIZE,
} from '@Core/defaults/theme';
import Button from '@UI/components/Button/Button';
import IconAdd from '@UI/components/Icons/Actions/IconAdd';
import PRIVILEGES from '@Users/config/privileges';
import {
    USER_CREATED_EVENT_NAME,
} from '@Users/defaults';

export default {
    name: 'CreateUserButton',
    components: {
        Button,
        IconAdd,
        CreateUserModalForm: () => import('@Users/components/Modals/CreateUserModalForm'),
    },
    data() {
        return {
            isModalVisible: false,
        };
    },
    computed: {
        isAllowedToCreate() {
            return this.$hasAccess([
                PRIVILEGES.USER.create,
            ]);
        },
        smallSize() {
            return SIZE.SMALL;
        },
    },
    methods: {
        onShowModal() {
            this.isModalVisible = true;
        },
        onCloseModal() {
            this.isModalVisible = false;
        },
        onCreatedData() {
            this.onCloseModal();

            const event = new CustomEvent(USER_CREATED_EVENT_NAME);

            document.documentElement.dispatchEvent(event);
        },
    },
};
</script>
