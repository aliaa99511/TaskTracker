// import React from "react";
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { DateUtils } from '../taskFilter/utils/DateUtils';
// import { Box, Button, Typography } from '@mui/material';
// import ToggleButtonView from "../../../../../../common/components/ToggleButtonView";

// interface HeaderProps {
//     onCreateClick: () => void;
//     onFilterClick: () => void;
//     view: 'table' | 'cards';
//     onViewChange: (view: 'table' | 'cards') => void;
// }

// const Header: React.FC<HeaderProps> = ({
//     onCreateClick,
//     onFilterClick,
//     view,
//     onViewChange
// }) => (
//     <Box display="flex" justifyContent="space-between" mb={2}>
//         <Box>
//             <Typography variant="h5"> قيد التنفيذ</Typography>
//             <Typography fontSize={14} color="text.secondary">
//                 {DateUtils.getFormattedArabicDate(new Date())}
//             </Typography>
//         </Box>

//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Button
//                 onClick={onFilterClick}
//                 sx={{ border: "1px solid #c5c5c5", px: 2 }}
//             >
//                 تصفية
//             </Button>
//             <Button
//                 startIcon={<AddCircleOutlineIcon sx={{ ml: 1.5 }} />}
//                 onClick={onCreateClick}
//                 sx={{
//                     backgroundColor: 'primary.main',
//                     color: '#fff',
//                     borderRadius: 2,
//                     pr: 1.2,
//                     pl: 2,
//                     '&:hover': { backgroundColor: 'primary.dark' }
//                 }}
//             >
//                 مهمة جديدة
//             </Button>
//             <ToggleButtonView
//                 view={view}
//                 setView={onViewChange}
//             />
//         </Box>
//     </Box>
// );

// export default Header;