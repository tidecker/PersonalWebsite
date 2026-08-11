import { Link } from "react-router";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center">
      <div>
        <p>
        <Link to="/admin" className="cursor-default">
            ©
        </Link>
        {" "}
        2026 Thomas Decker.</p>
      </div>
    </footer>
  )
}

export default Footer;