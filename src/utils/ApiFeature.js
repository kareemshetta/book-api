export default class ApiFeature {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  //![1]to make pagination
  paginate() {
    console.log("paginate");
    let page = this.queryString.page * 1 || 1;
    if (this.mongooseQuery.page <= 0) page = 1;
    let skip = (page - 1) * (this.queryString.limit || 4);
    this.page = page;
    this.mongooseQuery.skip(skip).limit(this.queryString.limit || 4);

    return this;
  }

  //![2] to make filter
  filter() {
    console.log("filter");
    let filterObj = { ...this.queryString };
    let excludedQuery = ["page", "sort", "fields", "keyword", "limit"];
    excludedQuery.forEach((q) => {
      delete filterObj[q];
    });
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(
      /\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,
      (match) => `$${match}`
    );
    filterObj = JSON.parse(filterObj);
    this.mongooseQuery.find(filterObj);
    return this;
  }

  //! [3] to make sort
  sort() {
    if (this.queryString.sort) {
      console.log("sort");

      let sortBy = this.queryString.sort.replace(/,/g, " ");
      this.mongooseQuery.sort(sortBy);
    }
    return this;
  }

  //![3] to make search
  search() {
    if (this.queryString.keyword) {
      console.log("search");
      this.mongooseQuery.find({
        $or: [
          {
            title: { $regex: this.queryString.keyword, $options: "i" },
          },
          {
            description: { $regex: this.queryString.keyword, $options: "i" },
          },
          {
            firstName: { $regex: this.queryString.keyword, $options: "i" },
          },
          {
            lastName: { $regex: this.queryString.keyword, $options: "i" },
          },
          {
            "address.country": {
              $regex: this.queryString.keyword,
              $options: "i",
            },
          },
          {
            "address.city": { $regex: this.queryString.keyword, $options: "i" },
          },
        ],
      });
    }
    return this;
  }

  //![4] to make select
  fields() {
    if (this.queryString.fields) {
      console.log("fields");
      let fields = this.queryString.fields.replace(/,/g, " ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
}

// queryString === request.query;
// ?price[gte]=300

//
