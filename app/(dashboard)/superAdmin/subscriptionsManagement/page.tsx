"use client";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
// import Loader from "../../components/Loader/page";
import {
  Search,
  Calendar,
  DollarSign,
  Users,
  Wallet,
  Filter,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  PauseCircle,
  Crown,
 
  UserPlus,
  Shield,
  Star,
  Euro,
} from "lucide-react";
// import { MembershipType, statusRequest } from "@/common/enums";
import StatsCard from "@/components/Cards/StatsCard";

// Types
type SubscriptionType = "basic" | "premium";
type SubscriptionStatus = "active" | "expired" | "cancelled" | "suspended";

interface Player {
  id: number;
  name: string;
  avatar?: string;
  phone?: string;
}

interface Subscription {
  id: number;
  playerId: number;
  playerName: string;
  playerAvatar?: string;
  subscriptionType: SubscriptionType;
  startDate: string;
  endDate: string;
  amountPaid: number;
  status: SubscriptionStatus;
  daysRemaining: number;
  lastPaymentDate?: string;
}

export default function SubscriptionsPage() {
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [search, setSearch] = useState("");
  // const [loading, setLoading] = useState<string>(statusRequest.LOADING);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<SubscriptionType | "all">("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionsData();
  }, []);

  const fetchSubscriptionsData = async () => {
    // setLoading(statusRequest.LOADING);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockSubscriptions: Subscription[] = [
        {
          id: 1,
          playerId: 1,
          playerName: "Ahmed Mohammed",
          subscriptionType: "premium",
          startDate: "2026-03-01",
          endDate: "2026-03-30",
          amountPaid: 300,
          status: "active",
          daysRemaining: 20,
          lastPaymentDate: "2026-03-01",
        },
        {
          id: 2,
          playerId: 2,
          playerName: "Sara Ahmed",
          subscriptionType: "premium",
          startDate: "2025-06-01",
          endDate: "2026-06-01",
          amountPaid: 2800,
          status: "active",
          daysRemaining: 52,
          lastPaymentDate: "2025-06-01",
        },
        {
          id: 3,
          playerId: 3,
          playerName: "Mohammed Ali",
          subscriptionType: "basic",
          startDate: "2025-12-01",
          endDate: "2026-03-01",
          amountPaid: 150,
          status: "expired",
          daysRemaining: -30,
          lastPaymentDate: "2025-12-01",
        },
        {
          id: 4,
          playerId: 4,
          playerName: "Nora Khalid",
          subscriptionType: "basic",
          startDate: "2026-03-15",
          endDate: "2026-04-14",
          amountPaid: 150,
          status: "active",
          daysRemaining: 5,
          lastPaymentDate: "2026-03-15",
        },
        {
          id: 5,
          playerId: 5,
          playerName: "Omar Hassan",
          subscriptionType: "premium",
          startDate: "2026-02-01",
          endDate: "2026-04-01",
          amountPaid: 300,
          status: "suspended",
          daysRemaining: -8,
          lastPaymentDate: "2026-02-01",
        },
        {
          id: 6,
          playerId: 6,
          playerName: "Layla Ibrahim",
          subscriptionType: "basic",
          startDate: "2026-03-10",
          endDate: "2026-04-09",
          amountPaid: 150,
          status: "active",
          daysRemaining: 10,
          lastPaymentDate: "2026-03-10",
        },
      ];

      setSubscriptions(mockSubscriptions);
      // setLoading(statusRequest.SUCCEEDED);
    } catch (err) {
      setError("Failed to load data");
      // setLoading(statusRequest.FAILED);
    }
  };

  // Statistics
  const statsCards = useMemo(() => {
    const activeCount = subscriptions.filter(
      (s) => s.status === "active",
    ).length;
    const expiredCount = subscriptions.filter(
      (s) => s.status === "expired",
    ).length;
    const premiumCount = subscriptions.filter(
      (s) => s.subscriptionType === "premium",
    ).length;
    const basicCount = subscriptions.filter(
      (s) => s.subscriptionType === "basic",
    ).length;
    const expiringSoon = subscriptions.filter(
      (s) =>
        s.status === "active" && s.daysRemaining <= 7 && s.daysRemaining > 0,
    ).length;
    const totalRevenue = subscriptions.reduce(
      (sum, s) => sum + s.amountPaid,
      0,
    );

    return [
      {
        title: "Active Companies",
        value: activeCount,
        icon: <CheckCircle className="w-7 h-7 text-green-600" />,
        bgColor: "bg-green-100",
        gradient: "from-green-500 to-emerald-600",
        description: "Currently active subscriptions",
      },
      {
        title: "Premium Companies",
        value: premiumCount,
        icon: <Crown className="w-7 h-7 text-yellow-600" />,
        bgColor: "bg-yellow-100",
        gradient: "from-yellow-500 to-amber-600",
        description: "Premium plan Companies",
      },
      {
        title: "Basic Companies",
        value: basicCount,
        icon: <Shield className="w-7 h-7 text-blue-600" />,
        bgColor: "bg-blue-100",
        gradient: "from-blue-500 to-cyan-600",
        description: "Basic plan Companies",
      },
      {
        title: "Expiring Soon",
        value: expiringSoon,
        icon: <Clock className="w-7 h-7 text-orange-600" />,
        bgColor: "bg-orange-100",
        gradient: "from-orange-500 to-amber-600",
        description: "Less than 7 days remaining",
      },
      {
        title: "Total Revenue",
        value: `${totalRevenue.toLocaleString()} `,
        icon: <Wallet className="w-7 h-7 text-purple-600" />,
        bgColor: "bg-purple-100",
        gradient: "from-purple-500 to-indigo-600",
        description: "All payments",
      },
    ];
  }, [subscriptions]);

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptions;

    if (filterStatus !== "all") {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }

    if (filterType !== "all") {
      filtered = filtered.filter((s) => s.subscriptionType === filterType);
    }

    if (search) {
      filtered = filtered.filter((s) =>
        s.playerName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filtered;
  }, [subscriptions, filterStatus, filterType, search]);

  // Actions
  const handleRenew = (subscriptionId: number) => {
   // router.push(`/subscriptions/renew/${subscriptionId}`);
    return
  };

  const handleViewDetails = (subscriptionId: number) => {
   // router.push(`/subscriptions/${subscriptionId}`);
   return
  };

  const handleCancel = (subscriptionId: number) => {
    console.log("Cancel subscription:", subscriptionId);
  };

  const handleAddSubscription = () => {
    return
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    const config = {
      active: {
        icon: <CheckCircle className="w-3 h-3" />,
        text: "Active",
        className: "bg-green-100 text-green-700",
      },
      expired: {
        icon: <AlertCircle className="w-3 h-3" />,
        text: "Expired",
        className: "bg-red-100 text-red-700",
      },
      suspended: {
        icon: <PauseCircle className="w-3 h-3" />,
        text: "Suspended",
        className: "bg-yellow-100 text-yellow-700",
      },
      cancelled: {
        icon: <XCircle className="w-3 h-3" />,
        text: "Cancelled",
        className: "bg-gray-100 text-gray-700",
      },
    };
    return config[status];
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen p-6">
      <div className=" mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {statsCards.map((card, i) => (
            <StatsCard
              key={i}
              title={{ text: card.title }}
              value={{ text: card.value }}
              icon={card.icon}
              bgColor={card.bgColor}
              gradient={card.gradient}
              description={card.description}
            />
          ))}
        </motion.div>

        {/* Subscription Type Cards - Basic vs Premium */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-purple-500" />
            Subscription Plans
            <span className="text-sm text-gray-500 font-normal">
              (Click to filter)
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Plan Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() =>
                setFilterType(filterType === "basic" ? "all" : "basic")
              }
              className={`cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                filterType === "basic"
                  ? "ring-2 ring-blue-500 shadow-lg scale-[1.02]"
                  : "hover:shadow-md"
              }`}
            >
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Shield className="w-8 h-8" />
                  </div>
                  <span className="text-3xl flex items-center font-bold"><Euro className="w-6 h-6  font-bold" />150 </span>
                </div>
                <h4 className="text-2xl font-bold mt-4">Basic Plan</h4>
                <p className="text-white/80 text-sm mt-1">30 days membership</p>
              </div>
              <div className="bg-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {
                      subscriptions.filter(
                        (s) => s.subscriptionType === "basic",
                      ).length
                    }{" "}
                    Companies
                  </span>
                  <span className="text-gray-600 flex items-center gap-1">
                    <Euro className="w-4 h-4" />
                    {subscriptions
                      .filter((s) => s.subscriptionType === "basic")
                      .reduce((sum, s) => sum + s.amountPaid, 0)}
                  </span>
                </div>
                <span className="text-blue-500 text-sm font-medium">
                  {filterType === "basic" ? "✓ Selected" : "View Company"}
                </span>
              </div>
            </motion.div>

            {/* Premium Plan Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() =>
                setFilterType(filterType === "premium" ? "all" : "premium")
              }
              className={`cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                filterType === "premium"
                  ? "ring-2 ring-yellow-500 shadow-lg scale-[1.02]"
                  : "hover:shadow-md"
              }`}
            >
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Crown className="w-8 h-8" />
                  </div>
                  
                  <span className="text-3xl font-bold flex items-center">  <Euro className="w-6 h-6  font-bold" />300 </span>
                </div>
                <h4 className="text-2xl font-bold mt-4">Premium Plan</h4>
                <p className="text-white/80 text-sm mt-1">
                  30 days + All benefits
                </p>
              </div>
              <div className="bg-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {
                      subscriptions.filter(
                        (s) => s.subscriptionType === "premium",
                      ).length
                    }{" "}
                    Companies
                  </span>
                  <span className="text-gray-600 flex items-center gap-1">
                    <Euro className="w-4 h-4" />
                    {subscriptions
                      .filter((s) => s.subscriptionType === "premium")
                      .reduce((sum, s) => sum + s.amountPaid, 0)}{" "}
                   
                  </span>
                </div>
                <span className="text-yellow-500 text-sm font-medium">
                  {filterType === "premium" ? "✓ Selected" : "View Companies"}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Companies Subscriptions
                <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-sm">
                  {filteredSubscriptions.length} members
                </span>
              </h2>

              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer pr-10"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <button
                  onClick={handleAddSubscription}
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  New Subscription
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 overflow-x-auto">
            {filteredSubscriptions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No subscriptions found</p>
              </div>
            ) : (
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-start py-3 px-4 text-gray-600 font-semibold">
                      Company
                    </th>
                    <th className="text-start py-3 px-4 text-gray-600 font-semibold">
                      Plan
                    </th>
                    <th className="text-start py-3 px-4 text-gray-600 font-semibold">
                      Start Date
                    </th>
                    <th className="text-start py-3 px-4 text-gray-600 font-semibold">
                      End Date
                    </th>
                    <th className="text-start py-3 px-4 text-gray-600 font-semibold">
                      Remaining
                    </th>
                    <th className="text-start py-3 px-4 text-gray-600 font-semibold">
                      Amount
                    </th>
                    <th className="text-start py-3 px-4 text-gray-600 font-semibold">
                      Status
                    </th>
                    <th className="text-start py-3 px-4 text-gray-600 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((sub) => {
                    const statusConfig = getStatusBadge(sub.status);
                    return (
                      <tr
                        key={sub.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center  gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-medium text-sm">
                                {sub.playerName.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-800">
                              {sub.playerName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                              sub.subscriptionType === "premium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {sub.subscriptionType === "premium" ? (
                              <Crown className="w-3 h-3" />
                            ) : (
                              <Shield className="w-3 h-3" />
                            )}
                            {sub.subscriptionType === "premium"
                              ? "Premium"
                              : "Basic"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {sub.startDate}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {sub.endDate}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-medium ${
                              sub.daysRemaining <= 0
                                ? "text-red-600"
                                : sub.daysRemaining <= 7
                                  ? "text-orange-600"
                                  : "text-green-600"
                            }`}
                          >
                            {sub.daysRemaining <= 0
                              ? "Expired"
                              : `${sub.daysRemaining} days`}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium flex items-center gap-1 text-gray-800">
                          <Euro className="w-4 h-4" />{sub.amountPaid} 
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}
                          >
                            {statusConfig.icon}
                            {statusConfig.text}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(sub.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Search className="w-4 h-4" />
                            </button>
                            {sub.status === "expired" && (
                              <button
                                onClick={() => handleRenew(sub.id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Renew"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                            {sub.status === "active" && (
                              <button
                                onClick={() => handleCancel(sub.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
