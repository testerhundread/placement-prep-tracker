package com.placementprep.config;

import com.placementprep.model.*;
import com.placementprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final TopicRepository topicRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initUsers();
        initTopics();
        initQuizzes();
    }

    private void initUsers() {
        if (!userRepository.existsByEmail("admin@prep.com")) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@prep.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created: admin@prep.com / admin123");
        }

        if (!userRepository.existsByEmail("student@prep.com")) {
            User student = User.builder()
                    .firstName("Test")
                    .lastName("Student")
                    .email("student@prep.com")
                    .password(passwordEncoder.encode("student123"))
                    .role("STUDENT")
                    .isActive(true)
                    .build();
            userRepository.save(student);
            System.out.println("Student user created: student@prep.com / student123");
        }
    }

    private void initTopics() {
        if (topicRepository.count() == 0) {
            List<Topic> topics = new ArrayList<>();

            // DSA Topics
            topics.addAll(Arrays.asList(
                    createTopic("Arrays", "DSA", 9, 85),
                    createTopic("Linked Lists", "DSA", 8, 80),
                    createTopic("Stacks", "DSA", 7, 75),
                    createTopic("Queues", "DSA", 7, 75),
                    createTopic("Trees", "DSA", 9, 90),
                    createTopic("Graphs", "DSA", 8, 85),
                    createTopic("Dynamic Programming", "DSA", 10, 95),
                    createTopic("Sorting Algorithms", "DSA", 6, 70),
                    createTopic("Searching Algorithms", "DSA", 6, 70),
                    createTopic("Hash Tables", "DSA", 7, 75)
            ));

            // Aptitude Topics
            topics.addAll(Arrays.asList(
                    createTopic("Quantitative Aptitude", "APTITUDE", 8, 80),
                    createTopic("Logical Reasoning", "APTITUDE", 8, 80),
                    createTopic("Verbal Ability", "APTITUDE", 7, 75),
                    createTopic("Data Interpretation", "APTITUDE", 7, 75)
            ));

            // Technical Topics
            topics.addAll(Arrays.asList(
                    createTopic("C Programming", "TECHNICAL", 6, 65),
                    createTopic("C++", "TECHNICAL", 7, 75),
                    createTopic("Java", "TECHNICAL", 8, 80),
                    createTopic("Python", "TECHNICAL", 8, 80),
                    createTopic("JavaScript", "TECHNICAL", 7, 75),
                    createTopic("SQL", "TECHNICAL", 8, 80),
                    createTopic("OOP Concepts", "TECHNICAL", 7, 75)
            ));

            // CS Fundamentals
            topics.addAll(Arrays.asList(
                    createTopic("Operating Systems", "OS", 8, 80),
                    createTopic("Database Management", "DBMS", 8, 80),
                    createTopic("Computer Networks", "CN", 7, 75),
                    createTopic("System Design", "SYSTEM_DESIGN", 9, 90)
            ));

            topicRepository.saveAll(topics);
            System.out.println("Topics initialized: " + topics.size());
        }
    }

    private Topic createTopic(String name, String category, int importance, int freq) {
        return Topic.builder()
                .name(name)
                .category(category)
                .description(name + " for placement preparation")
                .importanceWeight(importance / 10.0)
                .frequencyInPlacements(freq)
                .isActive(true)
                .build();
    }

    private void initQuizzes() {
        if (quizRepository.count() == 0) {
            // DSA Quiz
            List<Question> dsaQuestions = Arrays.asList(
                    createQuestion("What is the time complexity of binary search?", "O(1)", "O(log n)", "O(n)", "O(n²)", 1, "DSA", "MEDIUM"),
                    createQuestion("Which data structure uses LIFO principle?", "Queue", "Stack", "Array", "Linked List", 1, "DSA", "EASY"),
                    createQuestion("What is the worst case time complexity of QuickSort?", "O(n)", "O(n log n)", "O(n²)", "O(log n)", 2, "DSA", "MEDIUM"),
                    createQuestion("Which traversal gives nodes in sorted order for BST?", "Preorder", "Inorder", "Postorder", "Level order", 1, "DSA", "MEDIUM"),
                    createQuestion("What is the space complexity of merge sort?", "O(1)", "O(log n)", "O(n)", "O(n log n)", 2, "DSA", "MEDIUM")
            );
            createQuiz("DSA Fundamentals", "Test your basics of Data Structures", "DSA", "EASY", 10, 15, dsaQuestions);

            // Aptitude Quiz
            List<Question> aptQuestions = Arrays.asList(
                    createQuestion("If 3x + 7 = 22, what is x?", "3", "5", "7", "15", 1, "APTITUDE", "EASY"),
                    createQuestion("What is 15% of 200?", "25", "30", "35", "40", 1, "APTITUDE", "EASY"),
                    createQuestion("Complete: 2, 6, 12, 20, ?", "28", "30", "32", "36", 1, "APTITUDE", "MEDIUM"),
                    createQuestion("A train travels 60km in 1 hour. Speed in m/s?", "16.67", "20", "18", "22", 0, "APTITUDE", "MEDIUM"),
                    createQuestion("Find the average of first 10 natural numbers.", "4.5", "5", "5.5", "6", 2, "APTITUDE", "MEDIUM")
            );
            createQuiz("Aptitude Basics", "Practice quantitative and logical questions", "APTITUDE", "EASY", 10, 10, aptQuestions);

            // OS Quiz
            List<Question> osQuestions = Arrays.asList(
                    createQuestion("What is a deadlock?", "Process waiting", "Circular wait for resources", "CPU overload", "Memory overflow", 1, "OS", "MEDIUM"),
                    createQuestion("Which scheduling algorithm is preemptive?", "FCFS", "SJF", "Round Robin", "Priority", 2, "OS", "MEDIUM"),
                    createQuestion("What is thrashing?", "Excessive I/O", "Excessive paging", "CPU idle", "Process termination", 1, "OS", "HARD"),
                    createQuestion("What is virtual memory?", "Extra physical memory", "Logical memory", "Cache", "Register", 1, "OS", "EASY"),
                    createQuestion("Which is not a page replacement algorithm?", "FIFO", "LRU", "LFU", "SSF", 3, "OS", "MEDIUM")
            );
            createQuiz("Operating Systems", "Test your OS concepts", "OS", "MEDIUM", 10, 15, osQuestions);

            // DBMS Quiz
            List<Question> dbmsQuestions = Arrays.asList(
                    createQuestion("What is a primary key?", "First column", "Unique identifier", "Foreign key", "Index", 1, "DBMS", "EASY"),
                    createQuestion("Which normal form removes transitive dependency?", "1NF", "2NF", "3NF", "BCNF", 2, "DBMS", "HARD"),
                    createQuestion("What does SQL stand for?", "Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language", 0, "DBMS", "EASY"),
                    createQuestion("Which join returns all from left table?", "INNER", "LEFT", "RIGHT", "FULL", 1, "DBMS", "EASY"),
                    createQuestion("What is a transaction?", "Single query", "Atomic unit of work", "Backup", "Index", 1, "DBMS", "MEDIUM")
            );
            createQuiz("Database Management", "Test your DBMS knowledge", "DBMS", "MEDIUM", 10, 15, dbmsQuestions);

            // HR Quiz
            List<Question> hrQuestions = Arrays.asList(
                    createQuestion("Tell me about yourself - Best approach?", "Repeat resume", "Brief overview with highlights", "Personal life details", "Future goals only", 1, "HR", "EASY"),
                    createQuestion("Biggest weakness - Best answer?", "No weaknesses", "Real weakness with improvement", "Perfectionism", "None", 1, "HR", "EASY"),
                    createQuestion("Why should we hire you?", "Need job", "Skills match job", "Good salary", "Any work", 1, "HR", "EASY"),
                    createQuestion("Where do you see yourself in 5 years?", "CEO", "Manager role", "Industry expert", "Don't know", 2, "HR", "MEDIUM"),
                    createQuestion("Tell me about a challenge you overcame?", "Team conflict", "Technical problem", "Project deadline", "All of above", 3, "HR", "MEDIUM")
            );
            createQuiz("HR Interview Prep", "Common HR questions and answers", "HR", "EASY", 10, 10, hrQuestions);

            System.out.println("Quizzes initialized");
        }
    }

    private Question createQuestion(String text, String opt1, String opt2, String opt3, String opt4, int correct, String category, String difficulty) {
        return Question.builder()
                .text(text)
                .options(Arrays.asList(opt1, opt2, opt3, opt4))
                .correctOptionIndex(correct)
                .category(category)
                .difficulty(difficulty)
                .marks(2)
                .build();
    }

    private void createQuiz(String title, String desc, String category, String difficulty, int timeLimit, int totalMarks, List<Question> questions) {
        Quiz quiz = Quiz.builder()
                .title(title)
                .description(desc)
                .category(category)
                .difficulty(difficulty)
                .timeLimit(timeLimit)
                .totalMarks(totalMarks)
                .passingMarks((int)(totalMarks * 0.4))
                .questions(questions)
                .isActive(true)
                .build();
        quizRepository.save(quiz);
    }
}
