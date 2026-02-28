export default function Footer() {
    return (
        <footer className="footer" id="footer">
            <div className="footer-content">
                <div className="footer-logo logo-gradient">Gravity</div>
                <p className="footer-text">
                    Exploring the cosmos through{" "}
                    <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer">
                        NASA Open APIs
                    </a>
                    . Built with Next.js — data provided by NASA.
                </p>
                <p className="footer-text" style={{ marginTop: "0.5rem" }}>
                    © {new Date().getFullYear()} Salman Raj. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
