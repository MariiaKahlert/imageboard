(function () {
    Vue.component("modal-component", {
        template: "#modal-template",
        methods: {
            closeModal: function () {
                this.$emit("close");
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            description: "",
            username: "",
            title: "",
            file: null,
            showForm: false,
            imageId: null,
        },
        mounted: function () {
            axios.get("/images").then((response) => {
                this.images = response.data;
            });
        },
        methods: {
            handleChange: function (e) {
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
                        this.description = "";
                        this.username = "";
                        this.title = "";
                        this.file = null;
                    })
                    .catch((err) => console.log(err));
            },
            toggleImage: function (imageId) {
                this.imageId = imageId;
            },
            closeModal: function () {
                this.imageId = null;
            },
        },
    });
})();
