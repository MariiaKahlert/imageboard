(function () {
    Vue.component("comments-component", {
        template: "#comments-template",
        props: ["imageId"],
    });

    Vue.component("modal-component", {
        template: "#modal-template",
        props: ["imageId"],
        data: function () {
            return {
                description: "",
                username: "",
                title: "",
                created_at: "",
                url: "",
            };
        },
        mounted: function () {
            axios
                .get(`/images/${this.imageId}`)
                .then((response) => {
                    this.description = response.data.description;
                    this.title = response.data.title;
                    this.url = response.data.url;
                    this.username = response.data.username;
                    this.created_at = new Date(response.data.created_at)
                        .toUTCString()
                        .replace("GMT", "");
                })
                .catch((err) => console.log(err));
        },
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
            axios
                .get("/images")
                .then((response) => {
                    this.images = response.data;
                })
                .catch((err) => console.log(err));
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
                document.body.style.overflow = "hidden";
            },
            closeModal: function () {
                this.imageId = null;
                document.body.style.overflow = null;
            },
        },
    });
})();
