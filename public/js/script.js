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
            this.getComments();
        },
        watch: {
            function() {
                this.getComments();
            },
        },
        methods: {
            sendComment: function () {
                axios
                    .post("/comment", {
                        username: this.username,
                        comment_text: this.comment,
                        image_id: this.imageId,
                    })
                    .then((response) => {
                        this.comments.push(response.data);
                        this.username = "";
                        this.comment = "";
                        this.scrollToBottom();
                    })
                    .catch((err) => console.log(err));
            },
            getComments: function () {
                axios
                    .get(`/comments/${this.imageId}`)
                    .then((response) => {
                        this.comments = response.data;
                        if (this.comments.length > 0) {
                            this.scrollToBottom();
                        }
                    })
                    .catch((err) => console.log(err));
            },
            scrollToBottom: function () {
                this.$nextTick(() => {
                    this.$refs.commentsRef.scrollTop = this.$refs.commentsRef.scrollHeight;
                });
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
            this.getImage();
        },
        watch: {
            function() {
                this.getImage();
            },
        },
        methods: {
            closeModal: function () {
                this.$emit("close");
            },
            getImage: function () {
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
                    .catch((err) => {
                        console.log(err);
                        this.$emit("close");
                    });
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
            formErrorMessage: "",
        },
        mounted: function () {
            axios
                .get("/images")
                .then((response) => {
                    this.images = response.data;
                    this.$nextTick(() => {
                        const checkScrollPos = () => {
                            const scrolledToBottom =
                                window.innerHeight + window.pageYOffset >=
                                document.body.clientHeight - 150;
                            if (scrolledToBottom) {
                                this.loadImages();
                            }
                            setTimeout(checkScrollPos, 500);
                        };
                        checkScrollPos();
                    });
                })
                .catch((err) => console.log(err));
            if (location.hash) {
                this.imageId = location.hash.slice(1);
            }
            addEventListener("hashchange", () => {
                this.imageId = location.hash.slice(1);
            });
        },
        methods: {
            cancelForm: function () {
                this.showForm = false;
                this.formErrorMessage = "";
                this.title = "";
                this.description = "";
                this.username = "";
                this.file = null;
            },
            handleChange: function (e) {
                this.file = e.target.files[0];
            },
            submitFile: function () {
                if (!this.title || !this.username || !this.file) {
                    this.formErrorMessage =
                        "Something went wrong. Please, try again.";
                    return;
                }
                var formData = new FormData();
                formData.append("file", this.file);
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                axios
                    .post("/upload", formData)
                    .then((response) => {
                        this.images.unshift(response.data);
                        this.images.splice(-1, 1);
                        this.showForm = false;
                        this.description = "";
                        this.username = "";
                        this.title = "";
                        this.file = null;
                        this.formErrorMessage = "";
                    })
                    .catch((err) => console.log(err));
            },
            toggleImage: function (imageId) {
                this.imageId = imageId;
                document.body.style.overflow = "hidden";
            },
            closeModal: function () {
                this.imageId = null;
                history.pushState({}, "", "/");
                document.body.style.overflow = null;
            },
            loadImages: function () {
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
