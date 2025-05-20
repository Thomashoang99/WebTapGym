const { Schema, model } = require('mongoose');

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true,
        maxlength: 200
    },
    imageUrl: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    categories: {
        type: String,
        enum: ['Nutrition', 'Training', 'Recovery'],
        validate: [
            {
                validator: function(arr) {
                    return arr && arr.length > 0;
                },
                message: 'At least one category is required'
            }
        ]
    },
    tags: {
        type: [String],
        set: tags => tags.map(tag => tag.trim().toLowerCase())
    }
}, { timestamps: true });

// Add indexes for performance
ArticleSchema.index({
  title:     'text',
  content:   'text',
  summary:   'text',
  tags:      'text',
  categories:'text'
});

const Article = model('Article', ArticleSchema);
module.exports = Article;