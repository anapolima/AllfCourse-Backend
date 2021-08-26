module.exports = {
    validateCourseFlagId: (_id, _errors) => {
        const courseFlagId = _id.trim();

        if (typeof (courseFlagId) === 'string') {
            const eIndex = courseFlagId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(courseFlagId)) && Number(courseFlagId) > 0) {
                    // this.#id = Number(courseId);

                    // return this.#id;
                    return true;
                }

                _errors.push({ courseFlagId: 'The id must be a number, positive and non-zero, for example "5"' });
                return false;
            }

            // throw new Error("The number string must not contain the letter E/e");
            _errors.push({ courseFlagId: 'The number string must not contain the letter E/e' });
            return false;
        }

        // throw new Error("You should pass numbers as a string");
        _errors.push({ courseFlagId: 'You should pass numbers as a string' });
        return false;
    },
    validateCourseId: (_id, _errors) => {
        const courseId = _id.trim();

        if (typeof (courseId) === 'string') {
            const eIndex = courseId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(courseId)) && Number(courseId) > 0) {
                    // this.#id = Number(courseId);

                    // return this.#id;
                    return true;
                }

                _errors.push({ courseId: 'The id must be a number, positive and non-zero, for example "5"' });
                return false;
            }

            // throw new Error("The number string must not contain the letter E/e");
            _errors.push({ courseId: 'The number string must not contain the letter E/e' });
            return false;
        }

        // throw new Error("You should pass numbers as a string");
        _errors.push({ courseId: 'You should pass numbers as a string' });
        return false;
    },
    validateCategoryId: (_id, _errors) => {
        const categoryId = _id.trim();

        if (typeof (categoryId) === 'string') {
            const eIndex = categoryId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(categoryId)) && Number(categoryId) > 0) {
                    // this.#id = Number(courseId);

                    // return this.#id;
                    return true;
                }
                _errors.push({ categoryId: 'The id must be a number, positive and non-zero, for example "5"' });
                return false;
            }

            // throw new Error("The number string must not contain the letter E/e");
            _errors.push({ categoryId: 'The number string must not contain the letter E/e' });
            return false;
        }

        // throw new Error("You should pass numbers as a string");
        _errors.push({ categoryId: 'You should pass numbers as a string' });
        return false;
    },
};
