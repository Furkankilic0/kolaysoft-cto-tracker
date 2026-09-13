package com.kolaysoft.ctotracker.config;

import com.kolaysoft.ctotracker.entity.Project;
import com.kolaysoft.ctotracker.entity.User;
import com.kolaysoft.ctotracker.entity.WeeklyReport;
import com.kolaysoft.ctotracker.entity.enums.*;
import com.kolaysoft.ctotracker.repository.ProjectRepository;
import com.kolaysoft.ctotracker.repository.UserRepository;
import com.kolaysoft.ctotracker.repository.WeeklyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final WeeklyReportRepository reportRepository;

    @Override
    public void run(String... args) {

        if (userRepository.count() > 0) {
            return;
        }

        // --- Kullanicilar ---
        User admin = createUser("Sistem Yoneticisi", "admin@kolaysoft.com.tr", Role.ADMIN);
        User cto = createUser("Aysenur Yaylaci", "aysenur.yaylaci@kolaysoft.com.tr", Role.CTO);
        User pm1 = createUser("Furkan Kilic", "furkan.kilic@kolaysoft.com.tr", Role.PROJECT_MANAGER);
        User pm2 = createUser("Burhan Gumussoy", "burhan.gumussoy@kolaysoft.com.tr", Role.PROJECT_MANAGER);

        userRepository.save(admin);
        userRepository.save(cto);
        userRepository.save(pm1);
        userRepository.save(pm2);

        // --- Projeler ---
        Project p1 = createProject("e-Fatura Entegrasyon Modulu", "Vakif Katilim", "KS-2026-001",
                "GIB e-fatura sistemine yeni entegrasyon katmani",
                ProjectStatus.IN_PROGRESS,
                LocalDate.of(2026, 6, 1), LocalDate.of(2026, 12, 31), pm1);

        Project p2 = createProject("PEYK Izin Yonetimi", "Kolaysoft Ic Proje", "KS-2026-002",
                "Insan kaynaklari izin surecleri modulu",
                ProjectStatus.IN_TESTING,
                LocalDate.of(2026, 4, 15), LocalDate.of(2026, 10, 30), pm1);

        Project p3 = createProject("EczaciPOS Mobil Uygulama", "Eczane Zinciri A.S.", "KS-2026-003",
                "Eczane POS cihazlari icin mobil yonetim uygulamasi",
                ProjectStatus.DELAYED,
                LocalDate.of(2026, 3, 1), LocalDate.of(2026, 9, 30), pm2);

        Project p4 = createProject("e-Irsaliye Yenileme", "Lojistik Musterisi", "KS-2026-004",
                "e-Irsaliye altyapisinin yeni mevzuata uyarlanmasi",
                ProjectStatus.AT_RISK,
                LocalDate.of(2026, 7, 1), LocalDate.of(2027, 1, 31), pm2);

        projectRepository.save(p1);
        projectRepository.save(p2);
        projectRepository.save(p3);
        projectRepository.save(p4);

        // --- Haftalik raporlar ---
        // 36. hafta
        reportRepository.save(createReport(p1, pm1, 2026, 36,
                "Fatura sema dogrulama servisi tamamlandi. GIB test ortami baglantisi kuruldu.",
                "Toplu fatura gonderim kuyrugu gelistirilecek.",
                null, 40, 42, 5, ScheduleStatus.ON_TRACK, RiskLevel.LOW,
                "Proje planla uyumlu ilerliyor.", ReportStatus.REVIEWED, cto,
                "Ilerleme iyi, kuyruk tarafinda performans testi planlayin."));

        reportRepository.save(createReport(p3, pm2, 2026, 36,
                "Cihaz eslestirme ekrani tamamlandi.",
                "Odeme akisi entegrasyonu baslayacak.",
                "Test cihazlari tedarikte gecikme yasaniyor.",
                70, 55, 8, ScheduleStatus.DELAYED, RiskLevel.HIGH,
                "Donanim tedariki kritik yolda.", ReportStatus.REVIEWED, cto,
                "Tedarik icin alternatif saglayici arastirilsin."));

        // 37. hafta
        reportRepository.save(createReport(p1, pm1, 2026, 37,
                "Toplu gonderim kuyrugu gelistirildi. Birim testleri yazildi.",
                "Hata yonetimi ve yeniden deneme mekanizmasi eklenecek.",
                null, 50, 52, 4, ScheduleStatus.ON_TRACK, RiskLevel.LOW,
                "Hedefin bir miktar onunde.", ReportStatus.SUBMITTED, null, null));

        reportRepository.save(createReport(p2, pm1, 2026, 37,
                "Izin talep formu ve onay akisi test ekibine devredildi.",
                "Test geri bildirimleri uygulanacak.",
                "Test ekibinde kapasite darligi var.",
                85, 80, 3, ScheduleStatus.AT_RISK, RiskLevel.MEDIUM,
                "Test suresi uzayabilir.", ReportStatus.SUBMITTED, null, null));

        reportRepository.save(createReport(p4, pm2, 2026, 37,
                "Mevzuat analizi tamamlandi. Etki analizi dokumani hazirlandi.",
                "Sema donusum katmani gelistirilecek.",
                "Mevzuat metninde belirsiz maddeler var, GIB'e sorulacak.",
                25, 15, 6, ScheduleStatus.DELAYED, RiskLevel.CRITICAL,
                "Mevzuat belirsizligi kapsami etkileyebilir.", ReportStatus.DRAFT, null, null));
    }

    private User createUser(String fullName, String email, Role role) {
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword("123456");
        user.setRole(role);
        user.setActive(true);
        return user;
    }

    private Project createProject(String name, String customer, String code, String description,
                                  ProjectStatus status, LocalDate start, LocalDate end, User manager) {
        Project project = new Project();
        project.setName(name);
        project.setCustomer(customer);
        project.setCode(code);
        project.setDescription(description);
        project.setStatus(status);
        project.setStartDate(start);
        project.setTargetEndDate(end);
        project.setManager(manager);
        return project;
    }

    private WeeklyReport createReport(Project project, User reporter, int year, int week,
                                      String completed, String planned, String blockers,
                                      int target, int actual, int activeTasks,
                                      ScheduleStatus schedule, RiskLevel risk,
                                      String note, ReportStatus status,
                                      User reviewer, String ctoComment) {
        WeeklyReport report = new WeeklyReport();
        report.setProject(project);
        report.setReportedBy(reporter);
        report.setYear(year);
        report.setWeekNumber(week);
        report.setWeekStartDate(LocalDate.of(year, 1, 1).plusWeeks(week - 1));
        report.setWeekEndDate(LocalDate.of(year, 1, 1).plusWeeks(week - 1).plusDays(6));
        report.setCompletedWork(completed);
        report.setPlannedWork(planned);
        report.setBlockers(blockers);
        report.setTargetProgress(target);
        report.setActualProgress(actual);
        report.setActiveTaskCount(activeTasks);
        report.setScheduleStatus(schedule);
        report.setRiskLevel(risk);
        report.setGeneralNote(note);
        report.setStatus(status);

        if (reviewer != null) {
            report.setReviewedBy(reviewer);
            report.setCtoComment(ctoComment);
            report.setReviewedAt(LocalDateTime.now().minusDays(3));
        }

        return report;
    }
}