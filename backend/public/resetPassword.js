document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("resetForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const check = document.getElementById("check").value;
        const oldPassword = document.getElementById("oldPassword") ? document.getElementById("oldPassword").value : '';
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const newPasswordError = document.getElementById("newPasswordError");
        const confirmPasswordError = document.getElementById("confirmPasswordError");

        // Reset previous errors
        newPasswordError.textContent = "";
        confirmPasswordError.textContent = "";

        // Validation
        if (newPassword.length < 4) {
            newPasswordError.textContent = "Password must be at least 4 characters long.";
            return;
        }

        if (newPassword !== confirmPassword) {
            confirmPasswordError.textContent = "Passwords do not match!";
            return;
        }

        const pathname = window.location.pathname
        // const match = pathname.match(/\/api\/auth\/([^/]+)$/)
        // const token = match ? match[1] : null
        const parts = pathname.split('/')
        const token = parts[parts.length - 1]
        console.log('check: '+check+'')

        try {
            const response = await fetch(`/api/auth/forgot-password/${token}`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({ newPassword: newPassword+'', oldPassword: oldPassword+'', check: check+'' }),
            })

            const result = await response.json();

            if (result.success) {
                Toastify({
                    text: "✅ Password updated successfully!",
                    duration: 3000,
                    gravity: "top",
                    style: {
                        background: "#4caf50"
                    },
                }).showToast();

                if (check) {
                    setTimeout(() => window.location.href = "/login", 1800);     //Routed to /login page (frontend)
                }
                else {
                    setTimeout(() => window.location.href = "/", 1800);     //Routed to / page (frontend)
                }
                document.getElementById("check").value = ''
                document.getElementById("oldPassword") ? document.getElementById("oldPassword").value = '' : null
                document.getElementById("newPassword").value = ''
                document.getElementById("confirmPassword").value = ''
            } else {
                Toastify({
                    text: `❌ ${result.details || 'Failed to update password.'}`,
                    duration: 3000,
                    gravity: "top",
                    style: {
                        background: "#f44336"
                    },
                }).showToast();
            }
        } catch (error) {
            Toastify({
                text: "❌ Something went wrong. Please try again!",
                duration: 3000,
                gravity: "top",
                style: {
                    background: "#f44336"
                },
            }).showToast();
        }
    });
});
