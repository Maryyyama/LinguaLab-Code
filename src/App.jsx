import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import FAQPage from './pages/FAQPage';
import ContactsPage from './pages/ContactsPage';
import EntrancePage from './pages/EntrancePage';
import RegistrationPage from './pages/RegistrationPage';
import StudentPersonalInfo from './pages/StudentPersonalInfo';
import StudentContactInfo from './pages/StudentContactInfo';
import GradePage from './pages/GradePage';
import StudentSettingsPage from './pages/StudentSettingsPage';
import GermanCoursePage from './pages/GermanCoursePage';
import GermanCourseIntermediatePage from './pages/GermanCourseIntermediatePage';
import ChineseCourseIntermediatePage from './pages/ChineseCourseIntermediatePage';
import SpanishCourseIntermediatePage from './pages/SpanishCourseIntermediatePage';
import EnglishCourseIntermediatePage from './pages/EnglishCourseIntermediatePage';
import TeacherPersonalInfoPage from './pages/TeacherPersonalInfoPage';
import TeacherContactInfoPage from './pages/TeacherContactInfoPage';
import TeacherMethodicalWorkPage from './pages/TeacherMethodicalWorkPage';
import TeacherSettingsPage from './pages/TeacherSettingsPage';
import AdminPanelPage from './pages/AdminPanelPage';
import AdminLoginPage from './pages/AdminLoginPage';
import LicensePage from './pages/LicensePage';
import EnglishPaymentPage from './pages/EnglishPaymentPage';
import GermanPaymentPage from './pages/GermanPaymentPage';
import ChinesePaymentPage from './pages/ChinesePaymentPage';
import SpanishPaymentPage from './pages/SpanishPaymentPage';
import FrenchPaymentPage from './pages/FrenchPaymentPage';
import JapanesePaymentPage from './pages/JapanesePaymentPage';
import KoreanPaymentPage from './pages/KoreanPaymentPage';
import ItalianPaymentPage from './pages/ItalianPaymentPage';
import OplataEnglishPage from './pages/OplataEnglishPage';
import OplataChinesePage from './pages/OplataChinesePage';
import OplataSpanishPage from './pages/OplataSpanishPage';
import OplataGermanPage from './pages/OplataGermanPage';
import OplataFrenchPage from './pages/OplataFrenchPage';
import OplataJapanesePage from './pages/OplataJapanesePage';
import OplataKoreanPage from './pages/OplataKoreanPage';
import OplataItalianPage from './pages/OplataItalianPage';

import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Страницы оплаты курсов */}
        <Route path="/english-payment" element={<EnglishPaymentPage />} />
        <Route path="/german-payment" element={<GermanPaymentPage />} />
        <Route path="/chinese-payment" element={<ChinesePaymentPage />} />
        <Route path="/spanish-payment" element={<SpanishPaymentPage />} />
        <Route path="/french-payment" element={<FrenchPaymentPage />} />
        <Route path="/japanese-payment" element={<JapanesePaymentPage />} />
        <Route path="/korean-payment" element={<KoreanPaymentPage />} />
        <Route path="/italian-payment" element={<ItalianPaymentPage />} />
        <Route path="/oplata-english" element={<OplataEnglishPage />} />
        <Route path="/oplata-chinese" element={<OplataChinesePage />} />
        <Route path="/oplata-spanish" element={<OplataSpanishPage />} />
        <Route path="/oplata-german" element={<OplataGermanPage />} />
        <Route path="/oplata-french" element={<OplataFrenchPage />} />
        <Route path="/oplata-japanese" element={<OplataJapanesePage />} />
        <Route path="/oplata-korean" element={<OplataKoreanPage />} />
        <Route path="/oplata-italian" element={<OplataItalianPage />} />
        
        {/* Основные страницы */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/german-intermediate" element={<GermanCourseIntermediatePage />} />
        <Route path="/courses/chinese-intermediate" element={<ChineseCourseIntermediatePage />} />
        <Route path="/courses/spanish-intermediate" element={<SpanishCourseIntermediatePage />} />
        <Route path="/courses/english-intermediate" element={<EnglishCourseIntermediatePage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/license" element={<LicensePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/entrance" element={<EntrancePage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        
        {/* Страницы учеников */}
        <Route path="/student/personal" element={<StudentPersonalInfo />} />
        <Route path="/student/contact" element={<StudentContactInfo />} />
        <Route path="/student-contact" element={<StudentContactInfo />} />
        <Route path="/student-info" element={<StudentPersonalInfo />} />
        <Route path="/student/settings" element={<StudentSettingsPage />} />
        <Route path="/grade" element={<GradePage />} />
        <Route path="/course/german" element={<GermanCoursePage />} />
        <Route path="/course/german/intermediate" element={<GermanCourseIntermediatePage />} />
        
        {/* Страницы учителей */}
        {/* Динамические маршруты для любых ID преподавателей */}
        <Route path="/teacher/personal/:id" element={<TeacherPersonalInfoPage />} />
        <Route path="/teacher/contact/:id" element={<TeacherContactInfoPage />} />
        <Route path="/teacher/methodical/:id" element={<TeacherMethodicalWorkPage />} />
        <Route path="/teacher/settings/:id" element={<TeacherSettingsPage />} />
        
        {/* Админ-панель */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPanelPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;