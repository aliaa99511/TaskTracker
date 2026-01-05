import React from "react";
import {
    Drawer,
    Box,
    Typography,
    Divider,
    IconButton,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";

interface Props {
    open: boolean;
    onClose: () => void;
}

const AboutDrawer: React.FC<Props> = ({ open, onClose }) => {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            sx={{
                "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(0,0,0,0.4)"
                },
                "& .MuiDrawer-paper": {
                    width: 500,
                    direction: "rtl"
                }
            }}
        >
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 25 }}>عن التطبيق</Typography>

                    <IconButton
                        onClick={onClose}
                        sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "8px",
                            color: "text.primary"
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Version */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 20 }}>
                    الإصدار
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <Chip label="v1.0.5" variant="outlined" sx={{ px: .5 }} />
                </Box>

                {/* Description */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 20 }}>
                    وصف التطبيق
                </Typography>
                <Typography sx={{ mb: 2 }}>
                    تطبيق يساعد الفرق على تنظيم المهام، تتبع التنفيذ، والحفاظ على وضوح سير العمل من خلال واجهة سهلة وسريعة الاستخدام.
                </Typography>

                {/* Features */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 20 }}>
                    المميزات
                </Typography>

                <List sx={{ direction: "rtl" }}>
                    {[
                        "تنظيم واضح لسير العمل",
                        "متابعة دقيقة لتنفيذ المهام",
                        "توزيع منظم للمسؤوليات",
                        "رؤية شاملة للأداء اليومي",
                        "تجربة استخدام سهلة وسلسة"
                    ].map((item, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                py: 0.1,
                                display: "flex",
                                alignItems: "center",
                                textAlign: "right"
                                // flexDirection: "row-reverse"
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: "15px",
                                }}
                            >
                                <CircleIcon sx={{ fontSize: 5 }} />
                            </ListItemIcon>

                            <ListItemText primary={item} />
                        </ListItem>
                    ))}

                </List>


                <Divider sx={{ my: 2 }} />

                {/* Company */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 20 }}>
                    الشركة المطورة
                </Typography>

                <Box sx={{ background: "#F8F9FA", p: 2 }}>
                    <Typography sx={{ mb: 2 }}>
                        تم تطوير هذا التطبيق بواسطة
                        <b> Target Integrated Systems </b>
                        كحلً داخلي لإدارة وتنظيم العمل.
                    </Typography>

                    <Typography
                        component="a"
                        href="mailto:info@thetiscan.com"
                        sx={{ display: "block", color: "primary.main", mb: 1, fontSize: 15 }}
                    >
                        info@thetiscan.com
                    </Typography>

                    <Typography
                        component="a"
                        href="tel:+011511234880"
                        sx={{ display: "block", color: "primary.main", fontSize: 15 }}
                    >
                        +011 511 234 880
                    </Typography>
                </Box>
            </Box>
        </Drawer >
    );
};

export default AboutDrawer;
