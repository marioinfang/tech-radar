import mongoose from 'mongoose';
const { Schema } = mongoose;

export const TechnologyClassification = {
    ASSESS: 'Assess',
    TRIAL: 'Trial',
    ADOPT: 'Adopt',
    HOLD: 'Hold',
};

export const TechnologyCategory = {
    TECHNIQUES: 'Techniques',
    TOOLS: 'Tools',
    FRAMEWORKS: 'Frameworks',
    PLATFORM: 'Platforms',
}

const technologySchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, enum: TechnologyCategory, required: true },
    classification: { type: String, enum: TechnologyClassification },
    technologyDescription: { type: String, required: true },
    classificationDescription: { type: String },
    created: { type: Date, required: true },
    published: { type: Date },
    modified: { type: Date }
});

export const toTechnologyDto = (technology) => {
  return {
    id: technology._id.toString(),
    name: technology.name,
    category: technology.category,
    classification: technology.classification,
    technologyDescription: technology.technologyDescription,
    classificationDescription: technology.classificationDescription,
    created: technology.created,
    published: technology.published ?? null,
    modified: technology.modified ?? null
  };
};

export const toTechnologyListDto = (technologies) => {
  return technologies.map(toTechnologyDto);
};


export const Technology = mongoose.model('Technology', technologySchema);
