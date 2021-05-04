(function () {
    Vue.component("comments-component", {
        template: "#comments-template",
        props: ["imageId"],
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
            };
        },
        mounted: function () {
            axios
                .get(`/comments/${this.imageId}`)
                .then((response) => {
                    this.comments = response.data;
                    if (this.comments.length > 0) {
                        this.$nextTick(() => {
                            // console.log(this.$refs.commentsRef.scrollTop);
                            // console.log(this.$refs.commentsRef.scrollHeight);
                            // console.log(this.$refs.commentsRef.clientHeight);
                            this.$refs.commentsRef.scrollTop = this.$refs.commentsRef.scrollHeight;
                        });
                    }
                })
                .catch((err) => console.log(err));
        },
        methods: {
            sendComment: function () {
                console.log("Comment sent!");
                axios
                    .post("/comment", {
                        username: this.username,
                        comment_text: this.comment,
                        image_id: this.imageId,
                    })
                    .then((response) => {
                        this.comments.unshift(response.data);
                        this.username = "";
                        this.comment = "";
                    })
                    .catch((err) => console.log(err));
            },
        },
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
            loadImages: function () {
                console.log("More button clicked!");
                const lowestId = this.images[this.images.length - 1].id;
                axios
                    .get(`/moreimages/${lowestId}`)
                    .then((response) => {
                        for (let image in response.data) {
                            this.images.push(response.data[image]);
                        }
                    })
                    .catch((err) => console.log(err));
            },
        },
    });
})();
