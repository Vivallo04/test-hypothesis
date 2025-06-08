"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react"
import type { AnalysisResult } from "@/app/page"

interface ResultsInterpretationProps {
  result: AnalysisResult
}

export default function ResultsInterpretation({ result }: ResultsInterpretationProps) {
  const significanceLevel = 1 - result.confidenceLevel / 100
  const isSignificant = result.pValue < significanceLevel

  // Generate test-specific interpretation
  const getTestInterpretation = () => {
    if (result.testType.includes("t-test-independent")) {
      return {
        title: "Independent Samples T-Test",
        explanation: isSignificant
          ? `The independent samples t-test shows a statistically significant difference between the means of the groups (p = ${result.pValue.toFixed(
              4,
            )} < ${significanceLevel.toFixed(
              2,
            )}). This suggests that the difference observed between the groups is unlikely to have occurred by chance.`
          : `The independent samples t-test does not show a statistically significant difference between the means of the groups (p = ${result.pValue.toFixed(
              4,
            )} > ${significanceLevel.toFixed(
              2,
            )}). This suggests that any observed difference between the groups could be due to random variation.`,
        whatItMeans: isSignificant
          ? `The results indicate that there is a real difference between the groups being compared. The treatment or condition being studied likely has a genuine effect.`
          : `The results suggest that there is no detectable difference between the groups being compared. The treatment or condition being studied may not have a meaningful effect at this sample size.`,
        nextSteps: isSignificant
          ? `Consider calculating the effect size to determine the magnitude of the difference. You might also want to examine specific group differences and consider the practical significance of these findings.`
          : `Consider whether your sample size was large enough to detect a meaningful difference. You might want to conduct a power analysis or collect more data if you suspect there might still be an effect.`,
      }
    } else if (result.testType.includes("t-test-paired")) {
      return {
        title: "Paired Samples T-Test",
        explanation: isSignificant
          ? `The paired samples t-test shows a statistically significant difference between the paired measurements (p = ${result.pValue.toFixed(
              4,
            )} < ${significanceLevel.toFixed(
              2,
            )}). This suggests that the intervention or time effect produced a real change in the measured values.`
          : `The paired samples t-test does not show a statistically significant difference between the paired measurements (p = ${result.pValue.toFixed(
              4,
            )} > ${significanceLevel.toFixed(
              2,
            )}). This suggests that any observed changes could be due to random variation.`,
        whatItMeans: isSignificant
          ? `The results indicate that there is a real change or difference between the paired measurements. The intervention, treatment, or time effect being studied likely has a genuine impact.`
          : `The results suggest that there is no detectable change or difference between the paired measurements. The intervention, treatment, or time effect being studied may not have a meaningful impact at this sample size.`,
        nextSteps: isSignificant
          ? `Consider calculating the effect size to determine the magnitude of the change. You might also want to examine the direction and consistency of the changes across pairs.`
          : `Consider whether your sample size was large enough to detect a meaningful change. You might want to conduct a power analysis or collect more data if you suspect there might still be an effect.`,
      }
    } else if (result.testType.includes("anova")) {
      return {
        title: "One-Way ANOVA",
        explanation: isSignificant
          ? `The one-way ANOVA shows a statistically significant difference among the group means (p = ${result.pValue.toFixed(
              4,
            )} < ${significanceLevel.toFixed(
              2,
            )}). This suggests that at least one group mean is different from the others.`
          : `The one-way ANOVA does not show a statistically significant difference among the group means (p = ${result.pValue.toFixed(
              4,
            )} > ${significanceLevel.toFixed(
              2,
            )}). This suggests that any observed differences among groups could be due to random variation.`,
        whatItMeans: isSignificant
          ? `The results indicate that there are real differences among the groups being compared. The factor or treatment being studied likely has a genuine effect on the outcome.`
          : `The results suggest that there are no detectable differences among the groups being compared. The factor or treatment being studied may not have a meaningful effect at this sample size.`,
        nextSteps: isSignificant
          ? `Since ANOVA only tells you that differences exist but not which groups differ, you should conduct post-hoc tests (like Tukey's HSD) to identify specific group differences. Also consider calculating effect sizes.`
          : `Consider whether your sample size was large enough to detect meaningful differences. You might want to conduct a power analysis or collect more data if you suspect there might still be an effect.`,
      }
    } else if (result.testType.includes("chi-square")) {
      return {
        title: "Chi-Square Test",
        explanation: isSignificant
          ? `The chi-square test shows a statistically significant association between the categorical variables (p = ${result.pValue.toFixed(
              4,
            )} < ${significanceLevel.toFixed(
              2,
            )}). This suggests that the observed distribution differs from what would be expected if the variables were independent.`
          : `The chi-square test does not show a statistically significant association between the categorical variables (p = ${result.pValue.toFixed(
              4,
            )} > ${significanceLevel.toFixed(
              2,
            )}). This suggests that any observed association could be due to random variation.`,
        whatItMeans: isSignificant
          ? `The results indicate that there is a real association or relationship between the categorical variables being studied. The variables are not independent of each other.`
          : `The results suggest that there is no detectable association between the categorical variables being studied. The variables appear to be independent of each other at this sample size.`,
        nextSteps: isSignificant
          ? `Examine the standardized residuals to identify which specific cells contribute most to the significant result. Consider calculating effect sizes like Cramer's V to quantify the strength of the association.`
          : `Consider whether your sample size was large enough to detect a meaningful association. You might want to conduct a power analysis or collect more data if you suspect there might still be an association.`,
      }
    } else if (result.testType.includes("mann-whitney")) {
      return {
        title: "Mann-Whitney U Test",
        explanation: isSignificant
          ? `The Mann-Whitney U test shows a statistically significant difference between the distributions of the two groups (p = ${result.pValue.toFixed(
              4,
            )} < ${significanceLevel.toFixed(
              2,
            )}). This suggests that one group tends to have higher (or lower) values than the other.`
          : `The Mann-Whitney U test does not show a statistically significant difference between the distributions of the two groups (p = ${result.pValue.toFixed(
              4,
            )} > ${significanceLevel.toFixed(
              2,
            )}). This suggests that any observed differences could be due to random variation.`,
        whatItMeans: isSignificant
          ? `The results indicate that there is a real difference in the distributions of the two groups being compared. This non-parametric test is particularly useful when the data doesn't meet the assumptions for a t-test.`
          : `The results suggest that there is no detectable difference in the distributions of the two groups being compared. The groups appear to have similar distributions at this sample size.`,
        nextSteps: isSignificant
          ? `Consider calculating the effect size (e.g., r = Z/√N) to quantify the magnitude of the difference. Examine the median and distribution of each group to understand the nature of the difference.`
          : `Consider whether your sample size was large enough to detect a meaningful difference. You might want to conduct a power analysis or collect more data if you suspect there might still be an effect.`,
      }
    } else if (result.testType.includes("wilcoxon")) {
      return {
        title: "Wilcoxon Signed-Rank Test",
        explanation: isSignificant
          ? `The Wilcoxon signed-rank test shows a statistically significant difference between the paired measurements (p = ${result.pValue.toFixed(
              4,
            )} < ${significanceLevel.toFixed(
              2,
            )}). This suggests that the intervention or time effect produced a real change in the measured values.`
          : `The Wilcoxon signed-rank test does not show a statistically significant difference between the paired measurements (p = ${result.pValue.toFixed(
              4,
            )} > ${significanceLevel.toFixed(
              2,
            )}). This suggests that any observed changes could be due to random variation.`,
        whatItMeans: isSignificant
          ? `The results indicate that there is a real change or difference between the paired measurements. This non-parametric test is particularly useful when the data doesn't meet the assumptions for a paired t-test.`
          : `The results suggest that there is no detectable change or difference between the paired measurements. The intervention, treatment, or time effect being studied may not have a meaningful impact at this sample size.`,
        nextSteps: isSignificant
          ? `Consider calculating the effect size to determine the magnitude of the change. Examine the direction and consistency of the changes across pairs.`
          : `Consider whether your sample size was large enough to detect a meaningful change. You might want to conduct a power analysis or collect more data if you suspect there might still be an effect.`,
      }
    } else if (result.testType.includes("kruskal-wallis")) {
      return {
        title: "Kruskal-Wallis Test",
        explanation: isSignificant
          ? `The Kruskal-Wallis test shows a statistically significant difference among the distributions of the groups (p = ${result.pValue.toFixed(
              4,
            )} < ${significanceLevel.toFixed(
              2,
            )}). This suggests that at least one group has a distribution that differs from the others.`
          : `The Kruskal-Wallis test does not show a statistically significant difference among the distributions of the groups (p = ${result.pValue.toFixed(
              4,
            )} > ${significanceLevel.toFixed(
              2,
            )}). This suggests that any observed differences among groups could be due to random variation.`,
        whatItMeans: isSignificant
          ? `The results indicate that there are real differences among the groups being compared. This non-parametric test is particularly useful when the data doesn't meet the assumptions for ANOVA.`
          : `The results suggest that there are no detectable differences among the groups being compared. The groups appear to have similar distributions at this sample size.`,
        nextSteps: isSignificant
          ? `Since Kruskal-Wallis only tells you that differences exist but not which groups differ, you should conduct post-hoc tests (like Dunn's test) to identify specific group differences. Also consider calculating effect sizes.`
          : `Consider whether your sample size was large enough to detect meaningful differences. You might want to conduct a power analysis or collect more data if you suspect there might still be an effect.`,
      }
    } else {
      return {
        title: "Statistical Test",
        explanation: isSignificant
          ? `The statistical test shows a significant result (p = ${result.pValue.toFixed(
              4,
            )} < ${significanceLevel.toFixed(2)}). This suggests that the observed effect is unlikely to have occurred by chance.`
          : `The statistical test does not show a significant result (p = ${result.pValue.toFixed(
              4,
            )} > ${significanceLevel.toFixed(2)}). This suggests that any observed effect could be due to random variation.`,
        whatItMeans: isSignificant
          ? `The results indicate that there is a real effect or difference in the data being analyzed.`
          : `The results suggest that there is no detectable effect or difference in the data being analyzed at this sample size.`,
        nextSteps: isSignificant
          ? `Consider calculating effect sizes to determine the magnitude of the effect. Examine the practical significance of these findings.`
          : `Consider whether your sample size was large enough to detect a meaningful effect. You might want to conduct a power analysis or collect more data if you suspect there might still be an effect.`,
      }
    }
  }

  const interpretation = getTestInterpretation()

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-3">{interpretation.title} Results</h3>
        <p className="text-muted-foreground">{interpretation.explanation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Alert variant={isSignificant ? "default" : "secondary"} className="border-l-4 border-l-blue-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>What This Means</AlertTitle>
          <AlertDescription>{interpretation.whatItMeans}</AlertDescription>
        </Alert>

        <Alert variant="outline" className="border-l-4 border-l-purple-500">
          <HelpCircle className="h-4 w-4" />
          <AlertTitle>Recommended Next Steps</AlertTitle>
          <AlertDescription>{interpretation.nextSteps}</AlertDescription>
        </Alert>
      </div>

      {!isSignificant && (
        <Alert
          variant="destructive"
          className="bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900/30"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note on Non-Significant Results</AlertTitle>
          <AlertDescription>
            Failing to reject the null hypothesis does not prove that there is no effect. It only means that this study
            did not detect a statistically significant effect. This could be due to insufficient sample size, high
            variability in the data, or a truly small or non-existent effect.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
