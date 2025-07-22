const { formatImageUrl } = require("../imageUtils");

const formatCategoryData = (category) => {
    return {
        _id: category._id,
        name: category.name,
        description: category.description,
        image: formatImageUrl(category.image),
    };
};

module.exports = formatCategoryData;