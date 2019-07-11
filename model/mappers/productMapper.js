/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */

export function getMappedLayoutElement({
    label,
    type,
    properties,
    position,
    size,
}) {
    const { x: column, y: row } = position;
    const {
        attribute_id: id, required, hint, placeholder, parameters, options,
    } = properties;
    const { width, height } = size;

    return {
        id,
        row: row + 1,
        column: column + 1,
        width,
        height,
        type,
        label,
        hint,
        placeholder,
        required,
        parameters,
        options,
    };
}

export function getMappedLayoutSectionElement({
    label,
    position,
    size,
}) {
    const { x: column, y: row } = position;
    const { width, height } = size;

    return {
        row: row + 1,
        column: column + 1,
        width,
        height,
        type: 'SECTION TITLE',
        label,
    };
}

export function getMappedTemplateID(templates, selectedTemplate) {
    const templateByName = templates.find(
        template => template.name === selectedTemplate,
    );
    return templateByName
        ? templateByName.id
        : null;
}

export function getMappedLayoutElements(elements) {
    return elements.map((element) => {
        if (element.type === 'SECTION') {
            return getMappedLayoutSectionElement(element);
        }

        return getMappedLayoutElement(element);
    });
}
