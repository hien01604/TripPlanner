import '../style/BreadCrumb.css'
import { FiChevronRight } from "react-icons/fi";

function BreadCrumb({ tripName, pageName }) {
    return (
        <div className="bread-crumb">
            <span>{tripName}</span>
            <FiChevronRight />
            <strong>{pageName}</strong>
        </div>
    )
}

export default BreadCrumb