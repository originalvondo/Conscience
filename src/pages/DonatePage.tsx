import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Heart, 
  CreditCard, 
  Smartphone, 
  DollarSign,
  Gift,
  Coffee,
  Star
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Header from "@/components/Header"
import Footer from "@/components/footer"

const DonatePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const donationAmounts = [5, 10, 25, 50, 100, 250];
  const paymentMethods = [
    {
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Secure payment via Stripe",
      available: true
    },
    {
      name: "PayPal",
      icon: DollarSign,
      description: "Quick payment with PayPal",
      available: true
    },
    {
      name: "Apple Pay",
      icon: Smartphone,
      description: "One-touch payment",
      available: true
    },
    {
      name: "Google Pay",
      icon: Smartphone,
      description: "Fast and secure",
      available: true
    }
  ];

  const donationTiers = [
    {
      name: "Coffee Supporter",
      amount: 5,
      icon: Coffee,
      color: "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200",
      description: "Buy us a coffee to keep the creativity flowing",
      perks: ["Our eternal gratitude", "Good karma points"]
    },
    {
      name: "Story Patron",
      amount: 25,
      icon: Heart,
      color: "bg-rose-100 dark:bg-rose-900/20 text-rose-800 dark:text-rose-200",
      description: "Support quality journalism and storytelling",
      perks: ["Recognition in our monthly newsletter", "Early access to select articles"]
    },
    {
      name: "Magazine Champion",
      amount: 100,
      icon: Star,
      color: "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200",
      description: "Become a champion of independent media",
      perks: ["Special contributor badge", "Quarterly behind-the-scenes updates", "Input on future content themes"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header currentPage="donate"/>

      {/* Page Header */}
      <section className="bg-white dark:bg-gray-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 animate-fade-in dark:text-white">
            DONATE
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Support independent journalism and help us continue creating compelling stories and insightful content.
          </p>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 dark:text-white">Your Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Articles Published</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">10k+</div>
              <div className="text-gray-600 dark:text-gray-400">Monthly Readers</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-400">Contributing Authors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Choose Your Support Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationTiers.map((tier, index) => (
              <Card 
                key={tier.name} 
                className={`animate-fade-in cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedAmount === tier.amount ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedAmount(tier.amount)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <tier.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${tier.amount}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">{tier.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">What you get:</h4>
                    {tier.perks.map((perk, perkIndex) => (
                      <div key={perkIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center">
                        <Gift className="h-3 w-3 mr-2" />
                        {perk}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Amount */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Choose Your Own Amount</CardTitle>
              <CardDescription>Support us with any amount that feels right to you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {donationAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    onClick={() => setSelectedAmount(amount)}
                    className="h-12"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400">or enter custom amount:</span>
                <div className="mt-2 flex justify-center">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="0"
                      className="pl-8 pr-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white w-32 text-center"
                      onChange={(e) => setSelectedAmount(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Payment Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paymentMethods.map((method, index) => (
              <Card 
                key={method.name} 
                className="animate-fade-in cursor-pointer hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="text-center p-6">
                  <method.icon className="h-8 w-8 mx-auto mb-4 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-medium mb-2">{method.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                  {method.available ? (
                    <Badge variant="secondary" className="mt-2">Available</Badge>
                  ) : (
                    <Badge variant="outline" className="mt-2">Coming Soon</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donate Button */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Button 
            size="lg" 
            className="w-full max-w-md h-14 text-lg"
            disabled={!selectedAmount || selectedAmount <= 0}
          >
            <Heart className="h-5 w-5 mr-2" />
            Donate {selectedAmount ? `$${selectedAmount}` : ''}
          </Button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Your donation is secure and helps support independent journalism
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DonatePage;