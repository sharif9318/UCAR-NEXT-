import React, { SyntheticEvent, useState, useEffect } from "react";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import { AccordionDetails, Box, Stack, Typography } from "@mui/material";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useQuery } from "@apollo/client";
import { GET_CS_LIST } from "../../../apollo/user/query";
import { CsType, CsCategory } from "../../enums/cs.enum";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: "1.4rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "#fff",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const Faq = () => {
  const device = useDeviceDetect();
  const router = useRouter();
  const [category, setCategory] = useState<string>("CAR");
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [faqData, setFaqData] = useState<any>({});

  /** APOLLO REQUESTS **/
  const {
    loading: getFaqsLoading,
    data: getFaqsData,
    error: getFaqsError,
    refetch: getFaqsRefetch,
  } = useQuery(GET_CS_LIST, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        page: 1,
        limit: 100,
        sort: "createdAt",
        direction: "DESC",
        search: {
          csType: CsType.FAQ,
          csCategory: category as CsCategory,
        },
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const faqs = data?.getCsList?.list || [];
      setFaqData((prev: any) => ({
        ...prev,
        [category]: faqs,
      }));
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (category) {
      getFaqsRefetch({
        input: {
          page: 1,
          limit: 100,
          sort: "createdAt",
          direction: "DESC",
          search: {
            csType: CsType.FAQ,
            csCategory: category as CsCategory,
          },
        },
      });
    }
  }, [category]);

  /** HANDLERS **/
  const changeCategoryHandler = (category: string) => {
    setCategory(category);
  };

  const handleChange =
    (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  // Fallback data for when API data is not available
  const fallbackData: any = {
    CAR: [
      {
        id: "00f5a45ed8897f8090116a01",
        subject:
          "How do you ensure the reliability and quality of listed vehicles?",
        content:
          "All vehicles undergo a comprehensive verification process including mechanical inspection, accident history checks, and documentation validation to ensure reliability and quality standards.",
      },
      {
        id: "00f5a45ed8897f8090116a02",
        subject: "What vehicle categories and makes do you offer?",
        content:
          "We feature a diverse inventory including sedans, SUVs, trucks, luxury vehicles, electric cars, and hybrids from both domestic and international manufacturers.",
      },
      {
        id: "00f5a45ed8897f8090116a03",
        subject: "What search filters are available to find specific vehicles?",
        content:
          "Our advanced search includes filters for price range, vehicle type, year, mileage, fuel type, transmission, location, and specific features to help you find your ideal vehicle.",
      },
      {
        id: "00f5a45ed8897f8090116a04",
        subject: "Do you provide vehicle history reports?",
        content:
          "Yes, comprehensive vehicle history reports including accident records, service history, ownership details, and title status are available for all listed vehicles.",
      },
      {
        id: "00f5a45ed8897f8090116a05",
        subject: "What warranty or guarantee comes with purchased vehicles?",
        content:
          "Most vehicles include a standard warranty period. Extended warranty options are also available for purchase to provide additional protection and peace of mind.",
      },
      {
        id: "00f5a45ed8897f8090116a06",
        subject: "Can I schedule a test drive before purchasing?",
        content:
          "Yes, test drives can be scheduled through our platform. We coordinate with sellers to arrange convenient times for vehicle inspection and test driving.",
      },
      {
        id: "00f5a45ed8897f8090116a07",
        subject: "What post-purchase support do you offer?",
        content:
          "We provide 30-day post-purchase support including assistance with documentation transfer, registration, and addressing any concerns that may arise after purchase.",
      },
      {
        id: "00f5a45ed8897f8090116a08",
        subject: "Do you offer vehicle delivery services?",
        content:
          "Yes, we coordinate vehicle delivery services nationwide. Delivery costs vary based on distance and vehicle type, with options for expedited shipping.",
      },
      {
        id: "00f5a45ed8897f8090116a09",
        subject: "How current is your vehicle inventory?",
        content:
          "Our inventory is updated in real-time, with new vehicles added daily. We maintain accurate availability status to ensure you see currently available options.",
      },
      {
        id: "00f5a45ed8897f8090116a10",
        subject: "What financing options are available for vehicle purchases?",
        content:
          "We partner with multiple financial institutions to offer competitive auto loans, lease options, and financing plans tailored to different credit profiles and budgets.",
      },
    ],
    PAYMENT: [
      {
        id: "00f5a45ed8897f8090116a11",
        subject: "What payment methods do you accept?",
        content:
          "We accept bank transfers, credit/debit cards, certified checks, and financing through our partner institutions. All transactions are secured with encryption technology.",
      },
      {
        id: "00f5a45ed8897f8090116a12",
        subject: "Are there any hidden fees or additional charges?",
        content:
          "All fees are transparently displayed before purchase, including documentation fees, taxes, and registration costs. No hidden charges are applied to any transaction.",
      },
      {
        id: "00f5a45ed8897f8090116a13",
        subject: "Do you offer payment plans or installment options?",
        content:
          "Yes, we provide flexible payment plans through our financing partners, including options for down payments and monthly installments with competitive interest rates.",
      },
      {
        id: "00f5a45ed8897f8090116a14",
        subject: "How is my payment information protected?",
        content:
          "We use bank-level SSL encryption and PCI-compliant payment processing systems to ensure your financial information remains secure and confidential.",
      },
      {
        id: "00f5a45ed8897f8090116a15",
        subject: "When is payment required during the purchase process?",
        content:
          "A deposit is typically required to secure the vehicle, with the balance due upon finalizing the purchase agreement and before vehicle transfer.",
      },
      {
        id: "00f5a45ed8897f8090116a16",
        subject: "Can I get pre-approved for financing?",
        content:
          "Yes, we offer pre-approval for financing through our partner lenders, allowing you to know your budget before starting your vehicle search.",
      },
      {
        id: "00f5a45ed8897f8090116a17",
        subject: "What is your refund policy?",
        content:
          "Refunds are available under specific circumstances outlined in our purchase agreement, typically within a limited period and subject to vehicle condition and mileage restrictions.",
      },
      {
        id: "00f5a45ed8897f8090116a18",
        subject: "Do you accept trade-ins as part of payment?",
        content:
          "Yes, we accept vehicle trade-ins and provide fair market value assessments that can be applied toward your new vehicle purchase.",
      },
      {
        id: "00f5a45ed8897f8090116a19",
        subject: "Are there discounts for cash payments?",
        content:
          "While we don't typically offer cash discounts, we provide competitive pricing regardless of payment method. Financing through our partners often includes special promotions.",
      },
      {
        id: "00f5a45ed8897f8090116a20",
        subject: "How long does payment processing take?",
        content:
          "Electronic payments process immediately, while bank transfers typically clear within 1-2 business days. Vehicle release occurs after payment confirmation.",
      },
    ],
    BUYERS: [
      {
        id: "00f5a45ed8897f8090116a21",
        subject: "What should I consider when choosing a vehicle?",
        content:
          "Consider your budget, lifestyle needs, fuel efficiency, maintenance costs, insurance rates, resale value, and intended use to select the right vehicle for your requirements.",
      },
      {
        id: "00f5a45ed8897f8090116a22",
        subject: "How do I determine my realistic vehicle budget?",
        content:
          "Calculate total ownership costs including purchase price, insurance, maintenance, fuel, and potential repairs. We recommend vehicles costing no more than 15-20% of your monthly income.",
      },
      {
        id: "00f5a45ed8897f8090116a23",
        subject: "What documents do I need to complete a purchase?",
        content:
          "Required documents typically include government-issued ID, proof of insurance, proof of income for financing, and any trade-in vehicle documentation.",
      },
      {
        id: "00f5a45ed8897f8090116a24",
        subject: "Should I get a pre-purchase inspection?",
        content:
          "We highly recommend independent pre-purchase inspections for used vehicles. Our platform facilitates scheduling inspections with certified mechanics in your area.",
      },
      {
        id: "00f5a45ed8897f8090116a25",
        subject: "Can I negotiate the price of a vehicle?",
        content:
          "Yes, most prices are negotiable within reasonable limits. Our platform provides market comparison data to help you make informed offers.",
      },
      {
        id: "00f5a45ed8897f8090116a26",
        subject: "What red flags should I watch for during vehicle inspection?",
        content:
          "Look for signs of accidents, rust, mechanical issues, inconsistent maintenance records, unusual odors, and mismatched vehicle identification numbers.",
      },
      {
        id: "00f5a45ed8897f8090116a27",
        subject: "How does the buying process work from start to finish?",
        content:
          "The process includes search, vehicle selection, inspection, financing application, test drive, offer negotiation, paperwork completion, payment, and vehicle pickup/delivery.",
      },
      {
        id: "00f5a45ed8897f8090116a28",
        subject: "What protections do I have as a buyer?",
        content:
          "Buyer protections include vehicle history transparency, secure payment processing, contract review periods, and access to customer support throughout the process.",
      },
      {
        id: "00f5a45ed8897f8090116a29",
        subject: "Can I purchase a vehicle from another state?",
        content:
          "Yes, we facilitate interstate purchases including handling registration transfer, taxes, and compliance with state-specific requirements.",
      },
      {
        id: "00f5a45ed8897f8090116a30",
        subject: "What if I change my mind after purchase?",
        content:
          "While vehicle sales are typically final, we offer limited return options within specified periods for qualifying purchases, subject to terms and conditions.",
      },
    ],
    AGENTS: [
      {
        id: "00f5a45ed8897f8090116a31",
        subject: "What are the requirements to become a certified agent?",
        content:
          "Requirements include completing certification training, passing background checks, obtaining necessary state licenses, and demonstrating industry knowledge.",
      },
      {
        id: "00f5a45ed8897f8090116a32",
        subject: "What tools and resources do you provide to agents?",
        content:
          "Agents receive access to our CRM platform, marketing materials, training resources, client management tools, and competitive commission structures.",
      },
      {
        id: "00f5a45ed8897f8090116a33",
        subject: "How does the agent commission structure work?",
        content:
          "We offer competitive commission rates with tiered structures based on performance, plus bonuses for customer satisfaction and volume achievements.",
      },
      {
        id: "00f5a45ed8897f8090116a34",
        subject: "What training and support is available for new agents?",
        content:
          "New agents receive comprehensive training, mentorship programs, ongoing professional development, and 24/7 support from our experienced team.",
      },
      {
        id: "00f5a45ed8897f8090116a35",
        subject: "How do agents generate and manage leads?",
        content:
          "Our platform provides lead generation tools, automated follow-up systems, client relationship management software, and marketing support to help agents build their business.",
      },
      {
        id: "00f5a45ed8897f8090116a36",
        subject:
          "What are the expectations for agent availability and responsiveness?",
        content:
          "Agents are expected to maintain professional responsiveness, typically within 2-4 hours during business hours, and provide excellent customer service throughout transactions.",
      },
      {
        id: "00f5a45ed8897f8090116a37",
        subject: "Do agents work independently or as part of a team?",
        content:
          "We offer both independent and team-based working models, allowing agents to choose the structure that best fits their working style and career goals.",
      },
      {
        id: "00f5a45ed8897f8090116a38",
        subject: "What technology requirements are needed for agents?",
        content:
          "Agents need reliable internet access, a smartphone, and basic computer proficiency. We provide access to our specialized software and mobile applications.",
      },
      {
        id: "00f5a45ed8897f8090116a39",
        subject: "How do agents handle documentation and legal compliance?",
        content:
          "We provide standardized documentation templates, legal guidance, compliance checklists, and access to legal professionals to ensure all transactions meet regulatory requirements.",
      },
      {
        id: "00f5a45ed8897f8090116a40",
        subject: "What career advancement opportunities are available?",
        content:
          "Agents can advance to senior positions, management roles, training positions, or specialize in specific vehicle types or market segments with increased earning potential.",
      },
    ],
    MEMBERSHIP: [
      {
        id: "00f5a45ed8897f8090116a41",
        subject: "What membership tiers do you offer?",
        content:
          "We currently offer Basic (free) and Premium membership tiers, with plans to introduce additional tiers featuring enhanced benefits and services.",
      },
      {
        id: "00f5a45ed8897f8090116a42",
        subject: "What benefits do Premium members receive?",
        content:
          "Premium members enjoy early access to new listings, exclusive deals, priority support, reduced fees, and additional vehicle history information.",
      },
      {
        id: "00f5a45ed8897f8090116a43",
        subject: "How much does Premium membership cost?",
        content:
          "Premium membership is available for $29.99 monthly or $299 annually, with a 30-day free trial for new members to experience the benefits.",
      },
      {
        id: "00f5a45ed8897f8090116a44",
        subject: "Can I cancel my membership at any time?",
        content:
          "Yes, memberships can be cancelled anytime through your account settings. Annual memberships receive pro-rated refunds for unused months.",
      },
      {
        id: "00f5a45ed8897f8090116a45",
        subject: "Do you offer corporate or family membership plans?",
        content:
          "We offer corporate plans for businesses and family plans covering multiple users, both featuring discounted rates and additional management features.",
      },
      {
        id: "00f5a45ed8897f8090116a46",
        subject: "What exclusive content do members access?",
        content:
          "Members receive market insights, pricing guides, expert buying advice, early notification of special promotions, and exclusive video content.",
      },
      {
        id: "00f5a45ed8897f8090116a47",
        subject: "Are there membership discounts for frequent buyers?",
        content:
          "Yes, we offer loyalty discounts and special rates for members who frequently use our platform for vehicle purchases and services.",
      },
      {
        id: "00f5a45ed8897f8090116a48",
        subject: "How do I upgrade or change my membership level?",
        content:
          "Membership changes can be made through your account dashboard, with immediate access to new benefits upon upgrade confirmation.",
      },
      {
        id: "00f5a45ed8897f8090116a49",
        subject: "Do you offer student, military, or senior discounts?",
        content:
          "We provide special discounted membership rates for students, military personnel, veterans, and seniors with proper verification.",
      },
      {
        id: "00f5a45ed8897f8090116a50",
        subject: "What payment methods are accepted for membership fees?",
        content:
          "We accept all major credit cards, debit cards, PayPal, and bank transfers for membership payments with secure automatic renewal options.",
      },
    ],
    COMMUNITY: [
      {
        id: "00f5a45ed8897f8090116a51",
        subject: "What types of discussions are allowed in the community?",
        content:
          "Our community welcomes discussions about vehicle ownership, maintenance tips, buying experiences, market trends, and automotive news in a respectful manner.",
      },
      {
        id: "00f5a45ed8897f8090116a52",
        subject: "How do I report inappropriate content or behavior?",
        content:
          "Use the report feature on any post or profile, or contact our moderation team directly. We investigate all reports promptly and take appropriate action.",
      },
      {
        id: "00f5a45ed8897f8090116a53",
        subject: "Can I share photos and videos in the community?",
        content:
          "Yes, members can share relevant photos and videos. All content must adhere to our community guidelines and respect privacy and copyright laws.",
      },
      {
        id: "00f5a45ed8897f8090116a54",
        subject: "Are there expert moderators in the community?",
        content:
          "Our community is moderated by automotive experts, experienced mechanics, and industry professionals who provide accurate information and maintain discussion quality.",
      },
      {
        id: "00f5a45ed8897f8090116a55",
        subject: "Can I create private groups within the community?",
        content:
          "Yes, members can create private groups for specific interests, vehicle brands, or local communities with customizable privacy settings.",
      },
      {
        id: "00f5a45ed8897f8090116a56",
        subject: "How do I build reputation points in the community?",
        content:
          "Members earn reputation points through helpful contributions, quality posts, verified expertise, and positive feedback from other community members.",
      },
      {
        id: "00f5a45ed8897f8090116a57",
        subject:
          "What are the consequences for violating community guidelines?",
        content:
          "Violations may result in content removal, temporary suspension, or permanent banning depending on severity and frequency of offenses.",
      },
      {
        id: "00f5a45ed8897f8090116a58",
        subject: "Can I promote my business or services in the community?",
        content:
          "Limited business promotion is allowed in designated areas for verified businesses, following specific advertising guidelines to maintain community quality.",
      },
      {
        id: "00f5a45ed8897f8090116a59",
        subject: "How do I contact community administrators?",
        content:
          "Administrators can be contacted through the community help center, direct messaging, or email with typical response within 24 hours.",
      },
      {
        id: "00f5a45ed8897f8090116a60",
        subject: "Are community discussions monitored for accuracy?",
        content:
          "Yes, our moderation team monitors discussions for accuracy and may correct or remove misinformation to maintain reliable information quality.",
      },
    ],
    OTHER: [
      {
        id: "00f5a45ed8897f8090116a61",
        subject: "How do I contact customer support?",
        content:
          "Customer support is available via phone, email, and live chat during business hours, with emergency support for active transactions available 24/7.",
      },
      {
        id: "00f5a45ed8897f8090116a62",
        subject: "What are your business hours?",
        content:
          "Our main office operates Monday-Friday 9AM-7PM and Saturday 10AM-4PM local time, with online services available 24/7.",
      },
      {
        id: "00f5a45ed8897f8090116a63",
        subject: "Do you have physical locations I can visit?",
        content:
          "We have multiple physical locations nationwide. Visit our locations page to find the nearest office and schedule an appointment.",
      },
      {
        id: "00f5a45ed8897f8090116a64",
        subject: "How do I update my account information?",
        content:
          "Account information can be updated through your profile settings, with verification required for changes to contact information and payment methods.",
      },
      {
        id: "00f5a45ed8897f8090116a65",
        subject: "What is your privacy policy?",
        content:
          "We maintain strict privacy standards and never share personal information without consent. Detailed privacy practices are available in our comprehensive privacy policy.",
      },
      {
        id: "00f5a45ed8897f8090116a66",
        subject: "How do I delete my account?",
        content:
          "Accounts can be deleted through account settings, with a 30-day recovery period. Note that some transaction records may be retained for legal purposes.",
      },
      {
        id: "00f5a45ed8897f8090116a67",
        subject: "Do you offer services in multiple languages?",
        content:
          "Yes, our platform and support services are available in English, Spanish, and French, with additional language support coming soon.",
      },
      {
        id: "00f5a45ed8897f8090116a68",
        subject: "How can I provide feedback about your services?",
        content:
          "We welcome feedback through our website feedback form, customer satisfaction surveys, and direct communication with our customer experience team.",
      },
      {
        id: "00f5a45ed8897f8090116a69",
        subject: "What measures do you take for accessibility?",
        content:
          "Our platform meets WCAG 2.1 AA accessibility standards, with screen reader compatibility, keyboard navigation, and alternative text for all visual content.",
      },
      {
        id: "00f5a45ed8897f8090116a70",
        subject: "How do I stay updated with platform changes and news?",
        content:
          "Subscribe to our newsletter, follow our social media channels, or check the announcements section in your account for latest updates and feature releases.",
      },
    ],
  };

  if (device === "mobile") {
    return <div>FAQ MOBILE</div>;
  } else {
    return (
      <Stack className={"faq-content"}>
        <Box className={"categories"} component={"div"}>
          <div
            className={category === "CAR" ? "active" : ""}
            onClick={() => {
              changeCategoryHandler("CAR");
            }}
          >
            Car
          </div>
          <div
            className={category === "PAYMENT" ? "active" : ""}
            onClick={() => {
              changeCategoryHandler("PAYMENT");
            }}
          >
            Payment
          </div>
          <div
            className={category === "BUYERS" ? "active" : ""}
            onClick={() => {
              changeCategoryHandler("BUYERS");
            }}
          >
            For Buyers
          </div>
          <div
            className={category === "AGENTS" ? "active" : ""}
            onClick={() => {
              changeCategoryHandler("AGENTS");
            }}
          >
            For Agents
          </div>
          <div
            className={category === "MEMBERSHIP" ? "active" : ""}
            onClick={() => {
              changeCategoryHandler("MEMBERSHIP");
            }}
          >
            Membership
          </div>
          <div
            className={category === "COMMUNITY" ? "active" : ""}
            onClick={() => {
              changeCategoryHandler("COMMUNITY");
            }}
          >
            Community
          </div>
          <div
            className={category === "OTHER" ? "active" : ""}
            onClick={() => {
              changeCategoryHandler("OTHER");
            }}
          >
            Other
          </div>
        </Box>
        <Box className={"wrap"} component={"div"}>
          {(faqData[category]?.length
            ? faqData[category]
            : fallbackData[category]
          )?.map((ele: any) => (
            <Accordion
              expanded={expanded === (ele?._id || ele?.id)}
              onChange={handleChange(ele?._id || ele?.id)}
              key={ele?._id || ele?.id}
            >
              <AccordionSummary
                id="panel1d-header"
                className="question"
                aria-controls="panel1d-content"
              >
                <Typography className="badge" variant={"h4"}>
                  Q
                </Typography>
                <Typography> {ele?.csTitle || ele?.subject}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack className={"answer flex-box"}>
                  <Typography
                    className="badge"
                    variant={"h4"}
                    color={"primary"}
                  >
                    A
                  </Typography>
                  <Typography> {ele?.csContent || ele?.content}</Typography>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Stack>
    );
  }
};

export default Faq;
