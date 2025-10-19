// src/components/Sidebar.js
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Refrigerator,
  Leaf,
  Users,
} from "lucide-react";
import "../styles/sidebar.css";

export default function Sidebar() {
  const links = [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "Stock", path: "/dashboard/stock", icon: <Package size={18} /> },
    {
      name: "Orders",
      path: "/dashboard/orders",
      icon: <ShoppingCart size={18} />,
    },
    {
      name: "Coldroom",
      path: "/dashboard/inventory",
      icon: <Refrigerator size={18} />,
    },
    { name: "Harvests", path: "/dashboard/harvest", icon: <Leaf size={18} /> },
    { name: "Users", path: "/dashboard/users", icon: <Users size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">🌸 EverBloom</div>
      <nav>
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "active nav-item" : "nav-item"
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
