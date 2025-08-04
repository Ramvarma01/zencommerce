import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Header from "../components/header";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQS = [
  {
    question: "How do I track my order?",
    answer:
      "Go to Your Orders page. There, in your orders section, you can see the status.",
  },
  {
    question: "How do I return an item?",
    answer:
      "Please email our support team using the Contact Support button below.",
  },
  {
    question: "How do I change my shipping address?",
    answer: "Go to the profile page, then go to the Shipping Address option.",
  },
  {
    question: "How do I change my password?",
    answer:
      "Go to the profile page and use the Edit Password section.\n\nNote: Users logged in using Google have no option to change password.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can use the Contact Support button below or email us at support@zencommerce.com.",
  },
];

export default function HelpAndSupport() {
  const [expanded, setExpanded] = useState(null);

  const handleContactSupport = async () => {
    //  const phoneNumber = '+919876543210';
    // const url = `whatsapp://send?phone=${phoneNumber}`;

    const email= 'support@zencommerce.com';
    const url= `mailto:${email}`;
    
    const supported = await Linking.canOpenURL(url);

    if (supported) Linking.openURL(url);
     else Alert.alert("App not installed");
  };

  return (
    <SafeAreaView style={styles.Container}>
      <Header title={"Help & Support"} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQS.map((faq, idx) => (
          <View key={idx} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => setExpanded(expanded === idx ? null : idx)}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons
                name={expanded === idx ? "chevron-up" : "chevron-down"}
                size={20}
                color="#007AFF"
              />
            </TouchableOpacity>
            {expanded === idx && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </View>
        ))}
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactSupport}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.contactButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 18,
    textAlign: "center",
  },
  faqCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
