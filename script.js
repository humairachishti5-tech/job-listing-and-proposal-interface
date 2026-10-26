/* SKILLCONNECT JAVASCRIPT */

const SERVICE_KEY = "skillconnect_services";
const PROFILE_KEY = "skillconnect_profile";

/* SAMPLE SERVICE */

const sampleServices = [
    {
        id: 1,
        title: "Responsive Website Design",
        description: "I will create a modern website using HTML and CSS.",
        price: 50,
        delivery: 3,
        skills: "HTML, CSS, JavaScript",
        image: "https://placehold.co/600x350?text=Website+Design"
    }
];

/* GET SERVICES */

function getServices() {
    try {
        const saved = localStorage.getItem(SERVICE_KEY);

        if (saved === null) {
            localStorage.setItem(
                SERVICE_KEY,
                JSON.stringify(sampleServices)
            );

            return sampleServices.map(function (service) {
                return { ...service };
            });
        }

        const services = JSON.parse(saved);

        return Array.isArray(services) ? services : [];
    } catch (error) {
        return [];
    }
}

/* SAVE SERVICES */

function saveServices(services) {
    try {
        localStorage.setItem(SERVICE_KEY, JSON.stringify(services));
        return true;
    } catch (error) {
        alert("Unable to save services in this browser.");
        return false;
    }
}

/* PROFILE FUNCTIONS */

function getProfile() {
    const defaultProfile = {
        name: "Mehak Fatima",
        skills: "HTML, CSS, JavaScript",
        location: "Lahore, Pakistan"
    };

    try {
        const saved = localStorage.getItem(PROFILE_KEY);

        return saved
            ? { ...defaultProfile, ...JSON.parse(saved) }
            : defaultProfile;
    } catch (error) {
        return defaultProfile;
    }
}

function displayProfile() {
    const profile = getProfile();

    const name = document.getElementById("profileName");
    const skills = document.getElementById("profileSkills");
    const location = document.getElementById("profileLocation");
    const avatar = document.getElementById("profileAvatar");

    if (name) name.textContent = profile.name;
    if (skills) skills.textContent = profile.skills;
    if (location) location.textContent = profile.location;

    if (avatar) {
        avatar.textContent = profile.name.charAt(0).toUpperCase();
    }

    const nameInput = document.getElementById("nameInput");
    const skillsInput = document.getElementById("skillsInput");
    const locationInput = document.getElementById("locationInput");

    if (nameInput) nameInput.value = profile.name;
    if (skillsInput) skillsInput.value = profile.skills;
    if (locationInput) locationInput.value = profile.location;
}

const editProfileBtn = document.getElementById("editProfileBtn");
const profileEditor = document.getElementById("profileEditor");
const profileForm = document.getElementById("profileForm");
const cancelProfileBtn = document.getElementById("cancelProfileBtn");

if (editProfileBtn && profileEditor) {
    editProfileBtn.addEventListener("click", function () {
        profileEditor.classList.toggle("hidden");
    });
}

if (cancelProfileBtn && profileEditor) {
    cancelProfileBtn.addEventListener("click", function () {
        displayProfile();
        profileEditor.classList.add("hidden");
    });
}

if (profileForm) {
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const profile = {
            name: document.getElementById("nameInput").value.trim(),
            skills: document.getElementById("skillsInput").value.trim(),
            location: document.getElementById("locationInput").value.trim()
        };

        if (!profile.name || !profile.skills || !profile.location) {
            showMessage(
                "profileMessage",
                "Please fill in every field.",
                true
            );
            return;
        }

        try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
            displayProfile();
            profileEditor.classList.add("hidden");

            showMessage(
                "profileMessage",
                "Profile updated successfully!"
            );
        } catch (error) {
            showMessage(
                "profileMessage",
                "Could not save your profile.",
                true
            );
        }
    });
}

/* DISPLAY FORM MESSAGES */

function showMessage(id, message, isError) {
    const element = document.getElementById(id);

    if (!element) return;

    element.textContent = message;
    element.className = isError
        ? "message error"
        : "message success";
}

/* CREATE SERVICE */

const serviceForm = document.getElementById("serviceForm");

if (serviceForm) {
    serviceForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("serviceTitle").value.trim();
        const description =
            document.getElementById("serviceDescription").value.trim();
        const price = Number(
            document.getElementById("servicePrice").value
        );
        const delivery = Number(
            document.getElementById("deliveryTime").value
        );
        const skills = document.getElementById("serviceSkills").value.trim();
        const image = document.getElementById("serviceImage").value.trim();

        if (!title || !description || !skills || !image) {
            showMessage(
                "formMessage",
                "Please fill in all fields.",
                true
            );
            return;
        }

        if (!Number.isFinite(price) || price <= 0) {
            showMessage(
                "formMessage",
                "Enter a price greater than zero.",
                true
            );
            return;
        }

        if (!Number.isInteger(delivery) || delivery <= 0) {
            showMessage(
                "formMessage",
                "Delivery time must be a positive whole number.",
                true
            );
            return;
        }

        let validImageURL;

        try {
            validImageURL = new URL(image);

            if (
                validImageURL.protocol !== "https:" &&
                validImageURL.protocol !== "http:"
            ) {
                throw new Error("Invalid URL");
            }
        } catch (error) {
            showMessage(
                "formMessage",
                "Please enter a valid image URL.",
                true
            );
            return;
        }

        const services = getServices();

        services.push({
            id: Date.now(),
            title: title,
            description: description,
            price: price,
            delivery: delivery,
            skills: skills,
            image: validImageURL.href
        });

        if (!saveServices(services)) return;

        showMessage(
            "formMessage",
            "Service created! Opening your profile..."
        );

        serviceForm.reset();

        const previewBox = document.getElementById("imagePreviewBox");

        if (previewBox) {
            previewBox.classList.add("hidden");
        }

        setTimeout(function () {
            window.location.href = "profile.html";
        }, 800);
    });
}

/* IMAGE PREVIEW */

const imageInput = document.getElementById("serviceImage");

if (imageInput) {
    imageInput.addEventListener("input", function () {
        const previewBox = document.getElementById("imagePreviewBox");
        const preview = document.getElementById("imagePreview");
        const value = imageInput.value.trim();

        if (!previewBox || !preview) return;

        try {
            const url = new URL(value);

            if (
                url.protocol !== "https:" &&
                url.protocol !== "http:"
            ) {
                throw new Error("Invalid URL");
            }

            previewBox.classList.remove("hidden");
            preview.src = url.href;
        } catch (error) {
            preview.removeAttribute("src");
            previewBox.classList.add("hidden");
        }
    });
}

/* CREATE A SERVICE CARD */

function createServiceCard(service, showActions) {
    const card = document.createElement("article");
    card.className = "service-card";

    const image = document.createElement("img");
    image.src = service.image;
    image.alt = service.title;
    image.onerror = function () {
        image.style.display = "none";
    };

    const title = document.createElement("h3");
    title.textContent = service.title;

    const description = document.createElement("p");
    description.textContent = service.description;

    const price = document.createElement("p");
    price.className = "service-price";
    price.textContent = "$" + Number(service.price).toFixed(2);

    const delivery = document.createElement("p");
    delivery.textContent = "Delivery: " + service.delivery + " days";

    const tags = document.createElement("div");
    tags.className = "service-tags";

    service.skills.split(",").forEach(function (skill) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = skill.trim();

        if (tag.textContent) {
            tags.appendChild(tag);
        }
    });

    card.append(image, title, description, price, delivery, tags);

    if (showActions) {
        const actions = document.createElement("div");
        actions.className = "service-actions";

        const viewButton = document.createElement("button");
        viewButton.className = "btn";
        viewButton.textContent = "View";

        viewButton.addEventListener("click", function () {
            alert(
                service.title +
                "\n\n" + service.description +
                "\n\nPrice: $" + service.price +
                "\nDelivery: " + service.delivery + " days" +
                "\nSkills: " + service.skills
            );
        });

        const editButton = document.createElement("button");
        editButton.className = "btn btn-light";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            editService(service.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteService(service.id);
        });

        actions.append(viewButton, editButton, deleteButton);
        card.appendChild(actions);
    }

    return card;
}

/* DISPLAY SERVICES */

function displayServices() {
    const services = getServices();
    const servicesList = document.getElementById("servicesList");
    const homeServices = document.getElementById("homeServices");

    if (servicesList) {
        servicesList.replaceChildren();

        if (services.length === 0) {
            const message = document.createElement("p");
            message.className = "empty-state";
            message.textContent =
                "No services yet. Create your first service!";
            servicesList.appendChild(message);
        } else {
            services.forEach(function (service) {
                servicesList.appendChild(
                    createServiceCard(service, true)
                );
            });
        }
    }

    if (homeServices) {
        homeServices.replaceChildren();

        const featured = services.slice(0, 4);

        if (featured.length === 0) {
            const message = document.createElement("p");
            message.className = "empty-state";
            message.textContent = "No services available yet.";
            homeServices.appendChild(message);
        } else {
            featured.forEach(function (service) {
                homeServices.appendChild(
                    createServiceCard(service, false)
                );
            });
        }
    }
}

/* EDIT SERVICE */

function editService(id) {
    const services = getServices();

    const service = services.find(function (item) {
        return item.id === id;
    });

    if (!service) return;

    const title = prompt("Enter service title:", service.title);
    if (title === null) return;

    const description = prompt(
        "Enter service description:",
        service.description
    );
    if (description === null) return;

    const priceText = prompt("Enter price in USD:", service.price);
    if (priceText === null) return;

    const deliveryText = prompt(
        "Enter delivery time in days:",
        service.delivery
    );
    if (deliveryText === null) return;

    const skills = prompt("Enter skills/tags:", service.skills);
    if (skills === null) return;

    const image = prompt("Enter image URL:", service.image);
    if (image === null) return;

    const price = Number(priceText);
    const delivery = Number(deliveryText);

    if (
        !title.trim() ||
        !description.trim() ||
        !skills.trim() ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(delivery) ||
        delivery <= 0
    ) {
        alert("Please enter valid information in every field.");
        return;
    }

    let imageURL;

    try {
        imageURL = new URL(image.trim());

        if (
            imageURL.protocol !== "https:" &&
            imageURL.protocol !== "http:"
        ) {
            throw new Error("Invalid URL");
        }
    } catch (error) {
        alert("Please enter a valid image URL.");
        return;
    }

    service.title = title.trim();
    service.description = description.trim();
    service.price = price;
    service.delivery = delivery;
    service.skills = skills.trim();
    service.image = imageURL.href;

    if (saveServices(services)) {
        displayServices();
        alert("Service updated successfully!");
    }
}

/* DELETE SERVICE */

function deleteService(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    const services = getServices().filter(function (service) {
        return service.id !== id;
    });

    if (saveServices(services)) {
        displayServices();
        alert("Service deleted successfully!");
    }
}

/* RUN THE WEBSITE */

displayProfile();
displayServices();