function displayMessage(text, type) {
    const container = document.getElementById('message-container')

    const message = document.createElement('div')
    message.classList.add('message', type)
    message.textContent = text

    if (container.children.length >= 5) {
        container.firstChild.remove()
    }

    container.appendChild(message)

    requestAnimationFrame(() => {
        message.style.opacity = '1'
        message.style.transform = 'translateY(0)'
    })

    setTimeout(() => {
        message.style.opacity = '0'
        message.style.transform = 'translateY(20px)'
        setTimeout(() => {
            message.remove()
        }, 300)
    }, 3000)
}

function displayPopup(popupId) {
    const popup = document.getElementById('popup')
    const content = document.getElementById(popupId)

    popup.style.display = 'flex'
    content.style.display = 'block'

    popup.offsetHeight
    content.offsetHeight

    popup.style.opacity = '1'
    content.style.opacity = '1'
    content.style.transform = 'translateY(0)'

    content.querySelector("#close").addEventListener("click", (e) => {
        popup.style.opacity = '0'
        content.style.opacity = '0'
        content.style.transform = 'translateY(20px)'

        setTimeout(() => {
            popup.style.display = 'none'
            content.style.display = 'none'
        }, 300)
    })
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
        }
    })
})

document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

document.querySelectorAll("[location]").forEach(el => {
    el.addEventListener("click", () => {
        const targetId = el.getAttribute("location")
        const targetEl = document.getElementById(targetId)
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth" })
        }
    })
})

function loadWaitlistStats() {
    let waitlistStats = document.getElementById("waitlist-stats")
    let fillBar = document.querySelector("#fill > div")

    fetch("/api/get-waitlist-count", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
        .then(res => res.json())
        .then(data => {
            const count = data.count || 0
            const goal = data.goal || 1
            const percentage = Math.min(Math.round((count / goal) * 1000) / 10, 100)

            waitlistStats.children[0].textContent = `${count} on waitlist`
            waitlistStats.children[1].innerHTML = `<span>${percentage}% to launch goal</span>`

            fillBar.style.width = `${percentage}%`
        })
        .catch(() => {
            waitlistStats.children[0].textContent = `Error loading stats`
            waitlistStats.children[1].innerHTML = `<span>0% to launch goal</span>`
            fillBar.style.width = `0%`
        })
}

async function submitEmail(input) {
    let email = input.value.trim()

    if (!email) {
        displayMessage("Email is required", "error")
        return
    }

    try {
        const res = await fetch("/api/join-waitlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })

        const data = await res.json()

        if (!res.ok) {
            displayMessage(data.error || "Something went wrong", "error")
        } else {
            displayMessage("You've been added to the waitlist!", "success")
            input.value = ""

            if (document.getElementById("waitlist-stats")) {
                loadWaitlistStats()
            }
        }
    } catch (err) {
        displayMessage("Network error", "error")
        console.error(err)
    }
}

if (document.getElementById("join-btn")) {
    let joinBtn = document.getElementById("join-btn")
    let joinInput = document.getElementById("join-input")

    joinBtn.addEventListener("click", async (e) => {
        e.preventDefault()
        submitEmail(joinInput)
    })

    document.getElementById("join-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            submitEmail(joinInput)
        }
    })
}

if (document.getElementById("join-popup")) {
    const joinForm = document.querySelector("#join-form")

    joinForm.addEventListener("submit", (e) => {
        e.preventDefault()
        submitEmail(joinForm.querySelector("input"))
    })
}

if (document.getElementById("waitlist-stats")) {
    loadWaitlistStats()
}

if (document.getElementById("testimonials")) {
    const testimonials = [
        {
            message: "From tracking our shared fitness goals to planning weekend getaways, DINKLife has helped us stay aligned and excited about the life we’re building together.",
            name: "Jess & Leo",
            location: "Austin, TX",
            image: "/img/people/1.png"
        },
        {
            message: "DINKLife gave us an easy way to manage our finances and set long-term goals. We’ve never been more in sync.",
            name: "Maya & Chris",
            location: "San Diego, CA",
            image: "/img/people/2.png"
        },
        {
            message: "Whether it's grocery lists or planning our next trip, everything is smoother. Highly recommend it for modern couples.",
            name: "Sam & Taylor",
            location: "Denver, CO",
            image: "/img/people/3.png"
        },
        {
            message: "We've tried a lot of apps, but this one actually fits how we live. It’s like it was made for us.",
            name: "Jordan & Alex",
            location: "Brooklyn, NY",
            image: "/img/people/4.png"
        }
    ]

    let currentIndex = 0

    function renderTestimonial(index) {
        const data = testimonials[index]
        document.querySelector("#message p").textContent = data.message
        document.querySelector("#person-info a").textContent = data.name
        document.querySelector("#person-info p").textContent = data.location
        document.querySelector("#message img").src = data.image
    }

    document.querySelector("#actions .fa-chevron-left").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length
        renderTestimonial(currentIndex)
    })

    document.querySelector("#actions .fa-chevron-right").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % testimonials.length
        renderTestimonial(currentIndex)
    })

    renderTestimonial(currentIndex)
}

if (document.getElementById("download-btn")) {
    document.getElementById("download-btn").addEventListener("click", () => {
        const link = document.createElement("a")
        link.href = "/src/pitchdeck.pdf"
        link.download = "pitchdeck.pdf"
        document.body.appendChild(link)
        link.click()
        link.remove()
    })
}

if (document.getElementById("invest-form")) {
    document.getElementById("invest-form").addEventListener("submit", async (e) => {
        e.preventDefault()

        const name = document.getElementById("name-input").value.trim()
        const email = document.getElementById("email-input").value.trim()
        const amount = document.getElementById("amount-input").value.trim()
        const message = document.getElementById("message-input").value.trim()

        if (!email || !email.includes("@")) {
            displayMessage("Please enter a valid email", "error")
            return
        }

        try {
            const res = await fetch("/api/submit-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    amount: amount ? Number(amount) : null,
                    message
                })
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                displayMessage(data.error || "Failed to send message", "error")
                return
            }

            displayMessage("Message submitted successfully", "success")

            document.getElementById("invest-form").reset()
            document.getElementById("invest-popup").querySelector("#close").click()
        } catch (err) {
            console.error("Error submitting message:", err)
            displayMessage("Network error", "error")
        }
    })
}