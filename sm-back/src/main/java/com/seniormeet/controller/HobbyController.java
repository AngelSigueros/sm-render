package com.seniormeet.controller;

import com.seniormeet.model.Hobby;
import com.seniormeet.service.HobbyService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.seniormeet.service.FileService;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@RestController
@CrossOrigin("*")
@Slf4j
@RequestMapping("/hobbies")

public class HobbyController {

    private HobbyService hobbyService;
    private FileService fileService;

    // public HobbyController(HobbyService hobbyService) {
   //      this.hobbyService = hobbyService;
   // }

    @GetMapping
    public ResponseEntity<List<Hobby>> findAll() {
        List<Hobby> hobbies = hobbyService.findAll();
        return ResponseEntity.ok(hobbies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hobby> findById(@PathVariable Long id) {
        Hobby hobby = hobbyService.findById(id);
        if (hobby!=null)
            return ResponseEntity.ok(hobby);
        return ResponseEntity.notFound().build();
    }


    // MultipartFile
    @PostMapping()
    public ResponseEntity<Hobby> create(@RequestParam(value = "photo", required = false) MultipartFile file,
                                        Hobby hobby) {

        if(file != null && !file.isEmpty()) {
            String fileName = fileService.store(file);
            hobby.setPhotoUrl(fileName);
        } else {
            hobby.setPhotoUrl("avatar.png");
        }

        Hobby createdHobby = hobbyService.save(hobby);
        return  ResponseEntity.status(HttpStatus.CREATED).body(createdHobby);
    }

   @PutMapping("/{id}")
    public ResponseEntity<Hobby> updateHobby(@PathVariable Long id, Hobby hobby) {
        Hobby updateHobby = hobbyService.updateHobby(id, hobby);

        if (updateHobby != null) {
            return ResponseEntity.ok(updateHobby);
        } else {
            return ResponseEntity.notFound().build();
        }
   }

   @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHobby(@PathVariable Long id) {
        boolean deleted = hobbyService.deleteHobby(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();

   }
}
