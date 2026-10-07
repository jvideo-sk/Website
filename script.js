console.log("Welcome to jvideo.dev");

const birthDate = new Date("2008-09-02T00:00:00");

function setupMenu() {
    const menuButton = document.querySelector(".menu-toggle");
    const navLinks = document.getElementById("navLinks");

    if (!menuButton || !navLinks) return;

    const closeMenu = () => {
        navLinks.classList.remove("show");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open menu");
    };

    menuButton.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("show");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
        if (!navLinks.classList.contains("show")) return;
        if (navLinks.contains(event.target) || menuButton.contains(event.target)) return;
        closeMenu();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) closeMenu();
    });
}

function setupAge() {
    const ageSelector = document.getElementById("age");
    if (!ageSelector) return;

    const updateAge = () => {
        const age = (Date.now() - birthDate.getTime()) / 31557600000;
        ageSelector.textContent = `I am ${age.toFixed(20)} years old.`;
    };

    updateAge();
    window.setInterval(updateAge, 100);
}

async function loadProjects() {
    const container = document.getElementById("projects");
    if (!container) return;

    try {
        const response = await fetch(
            "https://api.github.com/users/jvideo-sk/repos?type=owner&sort=updated&per_page=100",
            {
                headers: {
                    Accept: "application/vnd.github+json"
                },
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const repos = await response.json();
        const visibleRepos = repos.filter(repo => !repo.fork);

        container.replaceChildren();

        if (visibleRepos.length === 0) {
            const card = document.createElement("article");
            card.innerHTML = `
                <h2>No projects yet</h2>
                <p>Nothing to show here right now.</p>
            `;
            container.appendChild(card);
            return;
        }

        for (const repo of visibleRepos) {
            const card = document.createElement("article");

            const title = document.createElement("h2");
            title.textContent = repo.name;

            const description = document.createElement("p");
            description.textContent = repo.description || "No description provided.";

            const link = document.createElement("a");
            link.href = repo.html_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "View Repository →";

            card.append(title, description, link);
            container.appendChild(card);
        }
    } catch (error) {
        console.error("Failed to load GitHub projects:", error);

        container.replaceChildren();

        const card = document.createElement("article");
        card.innerHTML = `
            <h2>Couldn't load projects</h2>
            <p>GitHub isn't responding right now. Try refreshing the page.</p>
            <a href="https://github.com/jvideo-sk?tab=repositories" target="_blank" rel="noopener noreferrer">
                View Repositories on GitHub →
            </a>
        `;
        container.appendChild(card);
    }
}

setupMenu();
setupAge();
loadProjects();
