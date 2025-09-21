const toTechnologyDto = (technology) => {
    return {
        id: technology._id.toString(),
        name: technology.name,
        category: technology.category,
        classification: technology.classification,
        technologyDescription: technology.technologyDescription,
        classificationDescription: technology.classificationDescription,
        published: !!technology.published
    };
};

const toTechnologyListDto = (technologies) => {
    return technologies.map(toTechnologyDto);
};

const mapTechnologyCreateDto = (body) => {
    return {
        name: body.name,
        category: body.category,
        classification: body.classification,
        technologyDescription: body.technologyDescription,
        classificationDescription: body.classificationDescription,
        created: new Date(),
        published: body.published ? new Date() : null,
        modified: null
    };
};

const mapTechnologyUpdateDto = (body, existingTechnology) => {
    const dto = {};

    if (body.name !== undefined) dto.name = body.name;
    if (body.category !== undefined) dto.category = body.category;
    if (body.classification !== undefined) dto.classification = body.classification;
    if (body.technologyDescription !== undefined) dto.technologyDescription = body.technologyDescription;
    if (body.classificationDescription !== undefined) dto.classificationDescription = body.classificationDescription;

    if (body.published === true && !existingTechnology.published) {
        dto.published = new Date();
    } else if (body.published === false && existingTechnology.published) {
        dto.published = null;
    }

    dto.modified = new Date();

    return dto;
};


export { toTechnologyDto, toTechnologyListDto, mapTechnologyCreateDto, mapTechnologyUpdateDto};
