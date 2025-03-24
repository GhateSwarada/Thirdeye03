package com.project.backend.Entity;

import java.util.Date;

import lombok.Data;

@Data
public class InvalidTokens {
	private String tokenId;
	private Date expiry;
}
