import { BlogBuilder } from "../components/blog/BlogBuilder";
const bloglist = [];

const blog = new BlogBuilder({
  title: "Terraform Associate (003) Guide",
  image: require('../assets/img/blog0/terraform associate.png'),
  description:
    "A walkthrough of how I studied and passed the HashiCorp Terraform Associate (003) exam.",
})
  .addHeading("Motivation to take the exam")
  .addParagraph("I decided to pursue the Terraform Associate exam to deepen my understanding of Infrastructure as Code (IaC) concepts and explore the benefits of using Terraform. I initially planned to take the cert in Jan 2024, but I was busy with school. Now, during my downtime in December, I’ve revisited the goal and decided to give it another try, and learned more about Terraform.")
  .addHeading("Exam Tips")
  .addParagraph(
    <>
      1. Go through the learning path - Terraform Associate 003. The learning path is available on the{" "}
      <a
        href="https://developer.hashicorp.com/terraform/tutorials/certification-003/associate-study-003"
        target="_blank"
        rel="noopener noreferrer"
      >
        HashiCorp official website
      </a>. It covers all the topics tested in the exam and is a great starting point to prepare and build your foundation in Terraform.
    </>
  )
  .addParagraph(
    "2. Practice the HashiCorp Certified: Terraform Associate Practice Exam 2025 by Bryan Krausen. The practice exam is available on Udemy. I recommend scoring at least 80% in all five exams. The questions in the practice exams are similar to those in the actual exam."
  )
  .addParagraph(
    <>
      3. Practice the Skillmix - Terraform Associate Certification Question Guide. The guide is available on{" "}
      <a
        href="https://docs.google.com/document/u/0/d/1KgtWQNRfLH5YYzBDEDB8WtPG5UeK_Cj4O9uz5YZfo8Y/mobilebasic"
        target="_blank"
        rel="noopener noreferrer"
      >
        Google Docs
      </a>. This practice paper is harder and more challenging compared to Bryan Krausen's practice exams. 
      I encountered a small subset of questions on the exam that were not covered in the learning path or Bryan Krausen's practice exams. 
      Credits to this{" "}
      <a
        href="https://www.reddit.com/r/Terraform/comments/1dgm42q/guide_to_pass_terraform_associate_003_exam/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Reddit post
      </a>{" "}
      on r/Terraform.
    </>
  )
  .addParagraph(
    <>
      4. Gain hands-on experience with Terraform. I used{" "}
      <a
        href="https://learn.kodekloud.com/user/courses/udemy-labs-terraform-for-beginners"
        target="_blank"
        rel="noopener noreferrer"
      >
        Udemy Labs - Terraform for Beginners
      </a>{" "}
      on KodeKloud to practice provisioning infrastructure with Terraform and some Terraform CLI commands.
    </>
  )
  .addParagraph(
    <>
      5. Read the documentation provided by HashiCorp. For example, understand the difference between "terraform plan" and "terraform plan -auto-approve." The documentation provides detailed examples for the flags used in Terraform CLI commands.
    </>
  );

bloglist.push(blog);

export default bloglist;