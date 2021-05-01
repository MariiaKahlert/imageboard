new Vue({
    el: "#main",
    data: {
        images: [],
        description: "",
        username: "",
        title: "",
        file: null,
        showForm: false,
    },
    mounted: function () {
        axios.get("/images").then((response) => {
            this.images = response.data;
        });
    },
    methods: {
        handleChange: function (e) {
            console.log("handleChange is running");
            this.file = e.target.files[0];
        },
        submitFile: function () {
            var formData = new FormData();
            formData.append("file", this.file);
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            axios
                .post("/upload", formData)
                .then((response) => {
                    this.images.unshift(response.data);
                    this.showForm = false;
                })
                .catch((err) => console.log(err));
        },
    },
});
