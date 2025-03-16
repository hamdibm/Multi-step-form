// MultiStepForm.tsx
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step } from "./step";
import { useFormStore } from "./store/useFormStore";
import * as z from "zod";
import { personalInfoSchema, addressSchema, passwordSchema } from "./validation";

// Create a combined schema for the entire form
const combinedSchema = z.object({
  ...personalInfoSchema.shape,
  ...addressSchema.shape,
  ...passwordSchema.shape,
});

// Type definition from the combined schema
type FormData = z.infer<typeof combinedSchema>;

const MultiStepForm = () => {
  const [step, setStep] = useState<Step>(Step.PersonalInfo);
  const { formData, updateFormData } = useFormStore();

  const isLastStep = step === Step.Confirmation;

  // Using a single resolver with the combined schema
  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm<FormData>({
    resolver: zodResolver(combinedSchema),
    defaultValues: formData,
    mode: "onTouched" // Validate on blur
  });

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    switch (step) {
      case Step.PersonalInfo:
        fieldsToValidate = ["name", "email"];
        break;
      case Step.AddressInfo:
        fieldsToValidate = ["address"];
        break;
      case Step.PasswordSetup:
        fieldsToValidate = ["password"];
        break;
      default:
        fieldsToValidate = [];
    }
    
    return await trigger(fieldsToValidate);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    updateFormData(data);
    alert("Form Submitted Successfully!");
    console.log("Final Form Data:", data);
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid) {
      // Save current data to store
      const currentValues = getValues();
      updateFormData(currentValues);
      
      // Move to next step
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-bold">Step {step} of 4</h2>
      
      {/* Step 1: Personal Info */}
      {step === Step.PersonalInfo && (
        <div className="space-y-4">
          <div>
            <input {...register("name")} placeholder="Name" className="border p-2 w-full" />
            {errors.name && <p className="text-red-500">{errors.name.message?.toString()}</p>}
          </div>
          <div>
            <input {...register("email")} placeholder="Email" className="border p-2 w-full" />
            {errors.email && <p className="text-red-500">{errors.email.message?.toString()}</p>}
          </div>
        </div>
      )}

      {/* Step 2: Address */}
      {step === Step.AddressInfo && (
        <div className="space-y-4">
          <div>
            <input {...register("address")} placeholder="Address" className="border p-2 w-full" />
            {errors.address && <p className="text-red-500">{errors.address.message?.toString()}</p>}
          </div>
        </div>
      )}

      {/* Step 3: Password Setup */}
      {step === Step.PasswordSetup && (
        <div className="space-y-4">
          <div>
            <input 
              {...register("password")} 
              type="password" 
              placeholder="Password" 
              className="border p-2 w-full" 
            />
            {errors.password && <p className="text-red-500">{errors.password.message?.toString()}</p>}
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === Step.Confirmation && (
        <div className="space-y-4">
          <h3 className="font-bold">Confirm your details</h3>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Address:</strong> {formData.address}</p>
          <p><strong>Password:</strong> ••••••••</p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        {step > Step.PersonalInfo && (
          <button 
            type="button" 
            onClick={() => setStep((prev) => prev - 1)} 
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        )}
        
        {!isLastStep ? (
          <button 
            type="button" 
            onClick={handleNext} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button 
            type="button" 
            onClick={handleSubmit(onSubmit)} 
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;