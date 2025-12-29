// import React from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { DateUtils } from '../../tasksLog/taskFilter/utils/DateUtils';
// import ToggleButtonView from '../../../../../../common/components/ToggleButtonView';

// interface TasksHeaderProps {
//     title: string;
//     onCreateClick: () => void;
//     onViewChange: (view: 'table' | 'cards') => void;
//     view: 'table' | 'cards';
// }

// const TasksHeader: React.FC<TasksHeaderProps> = ({
//     title,
//     onCreateClick,
//     onViewChange,
//     view,
// }) => {
//     return (
//         <Box display="flex" justifyContent="space-between" mb={3}>
//             <Box>
//                 <Typography variant="h5" fontWeight="bold" color="text.primary">
//                     {title}
//                 </Typography>
//                 <Typography fontSize={14} color="text.secondary">
//                     {DateUtils.getFormattedArabicDate(new Date())}
//                 </Typography>
//             </Box>

//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <Button
//                     startIcon={<AddCircleOutlineIcon />}
//                     onClick={onCreateClick}
//                     variant="contained"
//                     sx={{
//                         backgroundColor: 'primary.main',
//                         color: 'white',
//                         borderRadius: 2,
//                         px: 3,
//                         py: 1,
//                         '&:hover': {
//                             backgroundColor: 'primary.dark',
//                             transform: 'translateY(-1px)',
//                             boxShadow: 2
//                         }
//                     }}
//                 >
//                     مهمة جديدة
//                 </Button>

//                 <ToggleButtonView
//                     view={view}
//                     setView={onViewChange}
//                 />
//             </Box>
//         </Box>
//     );
// };

// export default TasksHeader;