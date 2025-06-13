const paginateResults = (model) => {
    return async (req, res, next) => {
        try {
            // Get page and limit from query parameters, set default limit to 6
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;

            // Calculate skip value for pagination
            const skip = (page - 1) * limit;

            // Get total count of documents
            const totalDocs = await model.countDocuments();
            const totalPages = Math.ceil(totalDocs / limit);

            // Add pagination info to request object
            req.pagination = {
                page,
                limit,
                skip,
                totalDocs,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            };

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = paginateResults; 